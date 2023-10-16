import dotenv from "dotenv"
import { ColorEngine } from "engine"

import { setupFastifyServer } from "./setupFastify"
import { setupWsServer } from "./setupWs"
import { setupMongooseDB } from "./setupMongooseDb"

dotenv.config()
dotenv.config({ path: ".env.local", override: true })

const HTTP_PORT = parseInt(process.env.LAMP_HTTP_SERVER_PORT || "", 10)
const WS_PORT = parseInt(process.env.LAMP_WS_SERVER_PORT || "", 10)

// TODO: Figure out how to get these to talk across servers.
const colorEngines: Map<string, ColorEngine> = new Map()

async function startUp() {
  // How do I get these to communicate with each other?
  // When I get a signel from the web socket, I need to
  // stop all of the existing animations.   Do we create
  // the engine map here and pass it down?  How can we create
  // a more generic "event" system that each could listen to..
  // That seem heavy...
  await setupMongooseDB()
  await setupFastifyServer(HTTP_PORT)
  await setupWsServer(WS_PORT)
}

startUp()
