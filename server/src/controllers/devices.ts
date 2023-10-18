import { FastifyReply, FastifyRequest } from "fastify"
import { v4 as uuidv4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { LampModel, ILamp, ILampAnimations } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiError, ApiResponse } from "../types"
import { ColorEngine } from "engine"
import { buildColorSender } from "../utils/colorPusher"
import { AnimationModel } from "../models/animation"

const engines: Map<string, ColorEngine> = new Map()

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<Array<ILamp & ILampAnimations>> {
  const lamps = await LampModel.find().exec()

  return lamps.map((l) => ({
    ...l.toObject(),
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
    guid: uuidv4(),
  })

  return lamp
}

export async function deleteDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<number> {
  const { deviceGuid } = request.params as { deviceGuid: string }
  const t = await LampModel.deleteOne({ guid: deviceGuid })

  if (t.deletedCount < 1) {
    return createError(
      reply,
      `Couldn't find lamp with guid: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )
  }

  return t.deletedCount
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

  const lamp = await LampModel.findOne({ guid: deviceGuid })
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceGuid}`,
      StatusCodes.NOT_FOUND
    )

  const animation = await AnimationModel.findOne({ guid: animationGuid })
  if (!animation)
    return createError(
      reply,
      `Couldn't find animation with id: ${animationGuid}`,
      StatusCodes.NOT_FOUND
    )

  if (!engines.has(lamp.guid)) {
    const newEngine = new ColorEngine(lamp.num_of_leds)
    newEngine.run(buildColorSender(lamp.num_of_leds, lamp.current_ip))
    engines.set(lamp.guid, newEngine)
  }

  const engine = engines.get(lamp.guid)
  if (engine) {
    return engine.toggleAnimation(animation.guid, animation.details)
  }

  reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  return { error: "Applying animation failed... Could not create animation." }
}
