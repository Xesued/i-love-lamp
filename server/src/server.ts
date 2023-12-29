import "./dotConfig"
import { ColorEngine } from "engine"

import { setupFastifyServer } from "./setupFastify"
import { setupWsServer } from "./setupWs"

const HTTP_PORT = parseInt(process.env.LAMP_HTTP_SERVER_PORT || "", 10)
const WS_PORT = parseInt(process.env.LAMP_WS_SERVER_PORT || "", 10)

// TODO: Figure out how to get these to talk across servers.
const colorEngines: Map<string, ColorEngine> = new Map()

async function startUp() {
  // How do I get these to communicate with each other?
  // When I get a signal from the web socket, I need to
  // stop all of the existing animations.   Do we create
  // the engine map here and pass it down?  How can we create
  // a more generic "event" system that each could listen to..
  // That seem heavy...
  await setupFastifyServer(HTTP_PORT)
  await setupWsServer(WS_PORT)
}

startUp()
