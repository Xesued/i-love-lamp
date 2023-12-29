import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { v4 as uuidv4 } from "uuid"

import * as Animation from "../models/animation"
import type { IAnimation } from "../models/animation"
import { createError } from "../utils/errors"
import type { ApiResponse } from "../types"

export async function createAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<IAnimation | null> {
  const animationParts = request.body as Omit<IAnimation, "guid">
  const animation = await Animation.createAnimation({
    ...animationParts,
    guid: uuidv4(),
  })

  return animation
}

export async function getAnimations(
  _request: FastifyRequest,
  _reply: FastifyReply
): ApiResponse<IAnimation[]> {
  const animations = await Animation.getAnimations()
  return animations
}

export async function removeAnimation(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<void> {
  const { animationGuid: guid } = request.params as { animationGuid: string }
  const successful = await Animation.deleteAnimation(guid)

  if (successful) {
    return createError(
      reply,
      `Couldn't find animation with guid: ${guid}`,
      StatusCodes.NOT_FOUND
    )
  }
}
