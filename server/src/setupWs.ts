import { WebSocketServer } from "ws"
import type { WebSocket } from "ws"
import { pushColors } from "./utils/colorPusher"
import { RGBW } from "engine/types"

export function setupWsServer(port: number) {
  const wss = new WebSocketServer({ port })
  wss.on("connection", handleConnection)
}

function handleConnection(ws: WebSocket) {
  ws.on("error", console.error)
  ws.on("message", handleMessage)
}

/**
 * Handles incoming messagse from a socket.
 *
 * @param data Buffer - The first 4 bytes make up the IP address
 * of the device we want to stream light to.  The following bytes
 * are the LED values for an RGBW led.
 */
function handleMessage(data: Buffer) {
  const ip = `${data[0]}.${data[1]}.${data[2]}.${data[3]}`
  const leds: RGBW[] = []

  let i = 4
  while (i + 4 < data.length) {
    leds.push([data[i + 0], data[i + 1], data[i + 2], data[i + 3]])
    i = i + 4
  }

  pushColors(leds, ip)
}
