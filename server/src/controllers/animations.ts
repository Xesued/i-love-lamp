import { ColorEngine } from "engine"
import { FastifyReply, FastifyRequest } from "fastify"
import type { AnimationItem } from "engine/types"
import { StatusCodes } from "http-status-codes"
import { v4 as uuidv4 } from "uuid"

import { AnimationModel } from "../models/animation"
import type { IAnimation } from "../models/animation"
import { createError } from "../utils/errors"
import type { ApiResponse } from "../types"

export async function createAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IAnimation> {
  const animationParts = request.body as Omit<IAnimation, "guid">
  const animation = await AnimationModel.create({
    ...animationParts,
    guid: uuidv4(),
  })

  return animation
}

export async function getAnimations(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IAnimation[]> {
  const animations = await AnimationModel.find().exec()
  return animations
}

export async function addAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> {
  reply.statusCode = StatusCodes.NOT_IMPLEMENTED
  return { error: "Applying animation not implemented" }
}

export async function removeAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<number> {
  const { animationGuid: guid } = request.params as { animationGuid: string }
  const t = await AnimationModel.deleteOne({ guid })

  if (t.deletedCount < 1) {
    return createError(
      reply,
      `Couldn't find animation with guid: ${guid}`,
      StatusCodes.NOT_FOUND
    )
  }

  return t.deletedCount
}
