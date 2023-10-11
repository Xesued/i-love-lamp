import fs from "fs"
import path from "path"
import Fastify from "fastify"
import cors from "@fastify/cors"

import { ColorEngine } from "engine"
import type { AnimationItem } from "engine/types"
import { buildColorSender } from "./colorPusher"

const LED_COUNT = 60
const engines: ColorEngine[] = []

async function startServer() {
  const fastify = Fastify({
    logger: true,
    https: {
      key: fs.readFileSync(
        path.join(__dirname, "./_wildcard.hell-fire.local+4-key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "./_wildcard.hell-fire.local+4.pem")
      ),
    },
  })
  await fastify.register(cors, {
    allowedHeaders: "*",
    origin: "*",
  })

  fastify.post("/animations/:ip", async (request, reply) => {
    const { ip } = request.params as { ip: string }
    const ipNum = parseInt(ip, 10)
    if (!engines[ipNum]) {
      engines[ipNum] = new ColorEngine(LED_COUNT)
      engines[ipNum].run(buildColorSender(LED_COUNT, ipNum))
    }

    const animationItem = request.body as AnimationItem
    const animation = ColorEngine.buildAnimation(animationItem, LED_COUNT)

    if (animation) {
      engines[ipNum].addAnimation(animationItem.id, animation)
      return { message: "Animation added" }
    }

    reply.statusCode = 500
    return { error: "Couldn't create the animation" }
  })

  fastify.delete("/animations/:ip/:animationId", async (request, reply) => {
    const { ip, animationId } = request.params as {
      ip: string
      animationId: string
    }
    if (animationId) {
      engines[parseInt(ip)]?.removeAnimation(animationId)
      return { message: "Animation removed" }
    }

    reply.statusCode = 500
    return { error: "Couldn't create the animation" }
  })

  // Run the server!
  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    console.log(`Server running on: ${address}`)
  })
}

startServer()
