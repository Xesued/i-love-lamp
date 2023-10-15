import { FastifyReply, FastifyRequest } from "fastify"
import { v4 as uuidv4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { LampModel, Lamp } from "../models/lamp"
import { createError } from "../utils/errors"
import type { ApiError } from "../types"

export async function getDevices(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<Lamp[]> {
  const lamps = await LampModel.find().exec()
  return lamps
}

export async function scanForDevices(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<ApiError | Lamp[]> {
  return createError(reply, "Not Implemented", StatusCodes.NOT_IMPLEMENTED)
}

export async function createDevice(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<Lamp> {
  const lampParts = request.body as Omit<Lamp, "guid">
  const lamp = await LampModel.create({
    guid: uuidv4(),
    ...lampParts,
  })

  return lamp
}
