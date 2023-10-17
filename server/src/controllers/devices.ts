import { FastifyReply, FastifyRequest } from "fastify"
import { v4 as uuidv4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { LampModel, ILamp } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiError } from "../types"
import { ColorEngine } from "engine"
import { buildColorSender } from "../utils/colorPusher"
import { AnimationModel } from "../models/animation"

type ApiResponse<T> = Promise<ApiError | T>

const engines: Map<string, ColorEngine> = new Map()

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<ILamp[]> {
  const lamps = await LampModel.find().exec()
  return lamps
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

export async function toggleAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<any> {
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
    engines.set(lamp.guid, new ColorEngine(lamp.num_of_leds))
    engines
      .get(lamp.guid)
      ?.run(buildColorSender(lamp.num_of_leds, lamp.current_ip))
  }

  const a = ColorEngine.buildAnimation(animation.details, lamp.num_of_leds)
  if (a) {
    engines.get(lamp.guid)?.addAnimation(animation.guid, a)
    return { message: "Animation added" }
  }

  reply.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  return { error: "Applying animation failed... Could not create animation." }
}
