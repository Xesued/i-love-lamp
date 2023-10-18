import Fastify from "fastify"
import cors from "@fastify/cors"

import { deviceRoutes } from "./routes/devices"
import { animationRoutes } from "./routes/animations"

export function setupFastifyServer(port: number) {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "@fastify/one-line-logger",
      },
    },
  })

  fastify.register(cors, {
    allowedHeaders: "*",
    origin: "*",
  })

  // Add all of the routes
  fastify.register(animationRoutes, { prefix: "/animations" })
  fastify.register(deviceRoutes, { prefix: "/devices" })

  // Run the server!
  fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    console.log(`Server running on: ${address}`)
  })
}
