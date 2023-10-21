import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { LampModel, ILamp } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiResponse } from "../types"
import { ColorEngine } from "engine"
import { buildColorSender } from "../utils/colorPusher"
import { AnimationModel } from "../models/animation"

const engines: Map<string, ColorEngine> = new Map()

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<Array<ILamp & { animationGuids: string[] }>> {
  const lamps = await LampModel.findAll()

  return lamps.map((l) => ({
    ...l.toJSON(),
    animationGuids: engines.get(l.guid)?.getAnimationGuids() || [],
  }))
}

export async function scanForDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<ILamp[]> {
  return createError(reply, "Not Implemented", StatusCodes.NOT_IMPLEMENTED)
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

  console.log("FOUND DEVICE", lamp.name)
  const animation = await AnimationModel.findOne({
    where: { guid: animationGuid },
  })
  if (!animation)
    return createError(
      reply,
      `Couldn't find animation with id: ${animationGuid}`,
      StatusCodes.NOT_FOUND
    )

  console.log("FOUND ANIMATION", animation.name)

  if (!engines.has(lamp.guid)) {
    const newEngine = new ColorEngine(lamp.numOfLeds)
    newEngine.run(buildColorSender(lamp.numOfLeds, lamp.currentIP))
    engines.set(lamp.guid, newEngine)
  }

  const engine = engines.get(lamp.guid)
  if (engine) {
    console.log("APPLINING ANIMTAION")
    return engine.toggleAnimation(animation.guid, animation.details)
  }

  reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  return { error: "Applying animation failed... Could not create animation." }
}
