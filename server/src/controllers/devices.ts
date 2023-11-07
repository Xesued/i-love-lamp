import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { LampModel, ILamp } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiResponse } from "../types"
import { ColorEngine } from "engine"
import {
  buildColorSender,
  Scanner,
  client,
  PingResponse,
} from "../utils/colorPusher"
import { AnimationModel } from "../models/animation"
import { RGBW } from "engine/types"
import { Op } from "sequelize"

const engines: Map<string, ColorEngine> = new Map()

type LampWithAnimations = ILamp & { animationGuids: string[] }

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<LampWithAnimations[]> {
  const lamps = await LampModel.findAll()

  return lamps.map((l) => ({
    ...l.toJSON(),
    animationGuids: engines.get(l.guid)?.getAnimationGuids() || [],
  }))
}

export async function scanForDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<LampWithAnimations[]> {
  let baseIp = "192.168.12"
  let scanner = new Scanner(baseIp, client)
  console.log("Scaning...")
  try {
    let results = await scanner.scan()

    if (results.length > 0) {
      await addNewDevices(baseIp, results)
    }

    const lamps = await LampModel.findAll()

    return lamps.map((l) => ({
      ...l.toJSON(),
      animationGuids: engines.get(l.guid)?.getAnimationGuids() || [],
    }))
  } catch (e) {
    console.log("Error occured", e)
  }

  return createError(reply, "Not Implemented", StatusCodes.NOT_IMPLEMENTED)
}

async function addNewDevices(baseIp: string, devices: PingResponse[]) {
  let currentLamps = await LampModel.findAll()
  let currentLampMacAddresses = currentLamps.map((c) => c.macAddress)

  let newLampMacAddress = devices.filter(
    (d) => !currentLampMacAddresses.includes(d.macAddress)
  )

  newLampMacAddress.forEach(async (macObj) => {
    let newLamp = {
      currentIP: `${baseIp}.${macObj.ipOctlet}`,
      name: `New Lamp ${macObj.ipOctlet}`,
      macAddress: macObj.macAddress,
      numOfLeds: macObj.numOfLeds,
    }
    await LampModel.create(newLamp)
  })
}

export async function createDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<ILamp> {
  const lampParts = request.body as Omit<ILamp, "guid">
  const lamp = await LampModel.create({
    ...lampParts,
  })

  return lamp
}

export async function updateDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<number> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const lampParts = request.body as Partial<ILamp>

  const [affectedCount] = await LampModel.update(
    {
      ...lampParts,
    },
    {
      where: {
        guid: deviceGuid,
      },
    }
  )

  return affectedCount
}

export async function deleteDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<number> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const deletedCount = await LampModel.destroy({ where: { guid: deviceGuid } })

  if (deletedCount < 1) {
    return createError(
      reply,
      `Couldn't find lamp with guid: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )
  }

  return deletedCount
}

export async function getDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<ILamp> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const lamp = await LampModel.findOne({ where: { guid: deviceGuid } })

  if (!lamp) {
    return createError(
      reply,
      `Couldn't find lamp with guid: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )
  }

  return lamp
}
/**
 * Bulk set an animations for a list of devices.
 *
 * @param request
 * @param reply
 * @returns
 */
export async function setAnimations(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<number> {
  const { deviceGuids, animationGuid, isOn } = request.body as {
    deviceGuids: string[]
    animationGuid: string
    isOn: boolean
  }

  const lamps = await LampModel.findAll({
    where: { guid: { [Op.in]: deviceGuids } },
  })
  if (!lamps)
    return createError(
      reply,
      `Couldn't find lamps with id`,
      StatusCodes.NOT_FOUND
    )

  lamps.forEach(async (lamp) => {
    const engine = getOrSetEngine(engines, lamp)
    if (!engine) {
      reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      return {
        error: "Applying animation failed... Could not create animation.",
      }
    }

    // Remove without having to query animation if we are removing it.
    if (!isOn) {
      return engine.removeAnimation(animationGuid)
    }

    const animation = await AnimationModel.findOne({
      where: { guid: animationGuid },
    })
    if (!animation)
      return createError(
        reply,
        `Couldn't find animation with id: ${animationGuid}`,
        StatusCodes.NOT_FOUND
      )

    engine.addAnimation(animation.guid, animation.details)
  })

  return lamps.length
}

/**
 * Toggles an animation to run.
 * @param request
 * @param reply
 * @returns
 */
export async function toggleAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<string[]> {
  const { deviceGuid, animationGuid } = request.params as {
    deviceGuid: string
    animationGuid: string
  }

  const lamp = await LampModel.findOne({ where: { guid: deviceGuid } })
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )

  const animation = await AnimationModel.findOne({
    where: { guid: animationGuid },
  })
  if (!animation)
    return createError(
      reply,
      `Couldn't find animation with id: ${animationGuid}`,
      StatusCodes.NOT_FOUND
    )

  const engine = getOrSetEngine(engines, lamp)
  if (engine) {
    return engine.toggleAnimation(animation.guid, animation.details)
  }

  reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  return { error: "Applying animation failed... Could not create animation." }
}

/**
 * Applies a solid color, rather than an animation
 *
 */
export async function setSolidColor(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<RGBW> {
  const { deviceGuid } = request.params as {
    deviceGuid: string
  }
  const color = request.body as RGBW

  const lamp = await LampModel.findOne({ where: { guid: deviceGuid } })
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )

  const engine = getOrSetEngine(engines, lamp)
  if (engine) {
    engine.setSolidColor(color)
    return color
  }

  return createError(
    reply,
    "Couldn't set color.",
    StatusCodes.INTERNAL_SERVER_ERROR
  )
}

function getOrSetEngine(
  engines: Map<string, ColorEngine>,
  lamp: ILamp
): ColorEngine | undefined {
  if (!engines.has(lamp.guid)) {
    const newEngine = new ColorEngine(lamp.numOfLeds)
    newEngine.setColorCollector(buildColorSender(lamp.currentIP))
    engines.set(lamp.guid, newEngine)
  }

  return engines.get(lamp.guid)
}
