import type { FastifyPluginCallback } from "fastify/types/plugin"

import * as animationController from "../controllers/animations"

export const animationRoutes: FastifyPluginCallback = (fastify, ops, done) => {
  fastify.get("/", animationController.getAnimations)
  fastify.post("/", animationController.createAnimation)
  fastify.delete("/:animationGuid", animationController.removeAnimation)

  done()
}
