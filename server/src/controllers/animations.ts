import { ColorEngine } from "engine"
import { FastifyReply, FastifyRequest } from "fastify"
import type { AnimationItem } from "engine/types"
import { StatusCodes } from "http-status-codes"

import { LampModel } from "../models/lamp"
import { buildColorSender } from "../utils/colorPusher"
import { createError } from "../utils/errors"

const engines: Map<string, ColorEngine> = new Map()

export async function addAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> {
  const { deviceId } = request.params as { deviceId: string }
  const lamp = await LampModel.findById(deviceId)
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceId}`,
      StatusCodes.NOT_FOUND
    )

  if (!engines.has(lamp.guid)) {
    engines.set(lamp.guid, new ColorEngine(lamp))
    engines
      .get(lamp.guid)
      ?.run(buildColorSender(lamp.num_of_leds, lamp.current_ip))
  }

  const animationItem = request.body as AnimationItem
  const animation = ColorEngine.buildAnimation(animationItem, lamp.num_of_leds)

  if (animation) {
    engines.get(lamp.guid)?.addAnimation(animationItem.id, animation)
    return { message: "Animation added" }
  }

  reply.statusCode = 500
  return { error: "Couldn't create the animation" }
}

export async function removeAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> {
  const { deviceId, animationId } = request.params as {
    deviceId: string
    animationId: string
  }
  const lamp = await LampModel.findById(deviceId)
  if (!lamp)
    return createError(
      reply,
      `Couldn't find lamp with id: ${deviceId}`,
      StatusCodes.NOT_FOUND
    )

  if (animationId) {
    engines.get(deviceId)?.removeAnimation(animationId)
    return { message: "Animation removed" }
  }

  reply.statusCode = 500
  return { error: "Couldn't create the animation" }
}
