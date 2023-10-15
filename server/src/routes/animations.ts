import type { FastifyPluginCallback } from "fastify/types/plugin"

import * as animationController from "../controllers/animations"

export const animationRoutes: FastifyPluginCallback = (fastify, ops, done) => {
  fastify.post("/:deviceId", animationController.addAnimation)
  fastify.delete(
    "/:deviceId/animations/:animationId",
    animationController.removeAnimation
  )

  done()
}
