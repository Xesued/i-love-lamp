import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { IDevice } from "../models/device"
import { createError } from "../utils/errors"
import type { ApiResponse } from "../types"
import { v4 as uuidv4 } from "uuid"
import { ColorEngine } from "engine"
import {
  Scanner,
  client,
  PingResponse,
  ColorCommunicator,
} from "../utils/colorPusher"
import * as Animation from "../models/animation"
import * as Device from "../models/device"
import { AnimationItem, RGBW } from "engine/types"

const engines: Map<string, ColorEngine> = new Map()
const colorCommunicator = new ColorCommunicator()

type LampWithAnimations = IDevice & {
  animationGuids: string[]
  colors?: RGBW[]
}

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<LampWithAnimations[]> {
  const lamps = await Device.getDevices()
  return lamps.map((l) => ({
    ...l,
    animationGuids: engines.get(l.guid)?.getAnimationGuids() || [],
    colors: engines.get(l.guid)?.getColors(),
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

    const lamps = await Device.getDevices()

    return lamps.map((l) => ({
      ...l,
      animationGuids: engines.get(l.guid)?.getAnimationGuids() || [],
      colors: engines.get(l.guid)?.getColors(),
    }))
  } catch (e) {
    console.log("Error occured", e)
  }

  return createError(reply, "Not Implemented", StatusCodes.NOT_IMPLEMENTED)
}

async function addNewDevices(baseIp: string, devices: PingResponse[]) {
  let currentLamps = await Device.getDevices()
  let currentLampMacAddresses = currentLamps.map((c) => c.macAddress)

  let newLampMacAddress = devices.filter(
    (d) => !currentLampMacAddresses.includes(d.macAddress)
  )

  const newDevices = newLampMacAddress.map((macObj) => ({
    guid: uuidv4(),
    currentIP: `${baseIp}.${macObj.ipOctlet}`,
    name: `New Lamp ${macObj.ipOctlet}`,
    macAddress: macObj.macAddress,
    numOfLeds: macObj.numOfLeds,
    description: "",
  }))

  await Device.addDevices(newDevices)
}

export async function createDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IDevice> {
  // TODO:
  const lampParts = request.body as Omit<IDevice, "guid">
  return {
    guid: "hi",
    ...lampParts,
  }
}

export async function updateDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IDevice> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const lampParts = request.body as Partial<IDevice>
  return Device.updateDevice(deviceGuid, lampParts)
}

export async function deleteDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<void> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const successful = await Device.deleteDevice(deviceGuid)

  if (successful) {
    return createError(
      reply,
      `Couldn't find lamp with guid: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )
  }
}

export async function getDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IDevice> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const lamp = await Device.getDevice(deviceGuid)

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
  const { deviceGuids, animationGuids } = request.body as {
    deviceGuids: string[]
    animationGuids: string[]
  }

  const lamps = await Device.getDevicesByIds(deviceGuids)
  if (!lamps)
    return createError(
      reply,
      `Couldn't find any devices with id`,
      StatusCodes.NOT_FOUND
    )

  const animations = await Animation.getAnimationsByGuids(animationGuids)
  if (!animations)
    return createError(
      reply,
      `Couldn't find any animations with given ids`,
      StatusCodes.NOT_FOUND
    )

  console.log("==== SETTING ANIMATIONS ON DEVICES =====")

  console.log({ lamps })
  console.log({ animations })

  const animationsByGuid = new Map<string, AnimationItem>()
  animations.forEach((anim) => {
    animationsByGuid.set(anim.guid, anim.details)
  })

  lamps.forEach(async (lamp) => {
    const engine = getOrSetEngine(engines, lamp)
    if (!engine) {
      reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      return {
        error: "Applying animation failed... Could not create animation.",
      }
    }

    engine.setAnimations(animationsByGuid)
    engine.run()
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

  const lamp = await Device.getDevice(deviceGuid)
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )

  const animation = await Animation.getAnimation(animationGuid)
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

  const lamp = await Device.getDevice(deviceGuid)
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
  lamp: IDevice
): ColorEngine | undefined {
  if (!engines.has(lamp.guid)) {
    const newEngine = new ColorEngine(lamp.numOfLeds)
    const sender = colorCommunicator.getColorSender(lamp.currentIP)
    newEngine.setColorCollector(sender)
    engines.set(lamp.guid, newEngine)
  }

  return engines.get(lamp.guid)
}
