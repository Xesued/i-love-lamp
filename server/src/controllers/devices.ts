import { FastifyReply, FastifyRequest } from "fastify"
import { v4 as uuidv4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { LampModel, Lamp } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiError } from "../types"

type ApiResponse<T> = Promise<ApiError | T>

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<Lamp[]> {
  const lamps = await LampModel.find().exec()
  return lamps
}

export async function scanForDevices(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<Lamp[]> {
  return createError(reply, "Not Implemented", StatusCodes.NOT_IMPLEMENTED)
}

export async function createDevice(
  request: FastifyRequest,
  reply: FastifyReply
): ApiResponse<Lamp> {
  const lampParts = request.body as Omit<Lamp, "guid">
  const lamp = await LampModel.create({
    guid: uuidv4(),
    ...lampParts,
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
