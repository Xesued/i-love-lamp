import { FastifyReply } from "fastify/types/reply"
import { StatusCodes } from "http-status-codes"
import type { ApiError } from "../types"

export function createError(
  reply: FastifyReply,
  msg: string,
  code: number = StatusCodes.INTERNAL_SERVER_ERROR
): ApiError {
  reply.statusCode = code
  return { error: msg }
}
