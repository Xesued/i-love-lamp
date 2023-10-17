import type { FastifyPluginCallback } from "fastify/types/plugin"

import * as deviceController from "../controllers/devices"

export const deviceRoutes: FastifyPluginCallback = (fastify, ops, done) => {
  fastify.get("/", deviceController.getDevices)
  fastify.post("/", deviceController.createDevice)
  fastify.post(
    "/:deviceGuid/applyAnimation/:animationGuid",
    deviceController.applyAnimation
  )
  fastify.delete("/:deviceGuid", deviceController.deleteDevice)
  fastify.post("/scan", deviceController.scanForDevices)
  done()
}