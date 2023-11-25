import udp from "dgram"
import type { RGBW } from "engine/types"
import { makeLedCommand, makePingCommand } from "./devicecommands"
import { WebSocketServer, WebSocket } from "ws"

export const client = udp.createSocket("udp4")

type LEDReceiver = (leds: RGBW[]) => void

/**
 * Object that helps push colors to devices, and communicate changes
 * to connected UIs on the websockets
 *
 */
export class ColorCommunicator {
  _wss: WebSocketServer
  _colorSenders: Map<string, LEDReceiver> = new Map()

  constructor() {
    this._wss = new WebSocketServer({ port: 3002 })
    this._wss.on("connection", this._handleWsConnection)
    this._wss.on("error", this._handleWsError)
  }

  getColorSender(ip: string) {
    let sender = this._colorSenders.get(ip)
    if (sender) return sender

    sender = this._buildColorSender(ip)
    this._colorSenders.set(ip, sender)
    return sender
  }

  _buildColorSender(ip: string) {
    return (leds: RGBW[]) => {
      pushColors(leds, ip)
      this._colorEvent(leds, ip)
    }
  }

  /**
   * Called when we push new colors to devices.  When this happens,
   * we want to let all of the connected devices know so they
   * can update their previews
   */
  _colorEvent(leds: RGBW[], ip: string) {
    let sender = this._colorSenders.get(ip)
    if (!sender) return

    this._wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        let message = {
          type: "LED_UPDATE",
          ip: ip,
          leds: leds,
        }
        c.send(JSON.stringify(message))
      }
    })
  }

  _handleWsConnection() {
    console.log("====")
    console.log("New client connected")
    console.log("====")
  }

  _handleWsError(e: any) {
    console.log("!!!!")
    console.log("ERROR", e)
    console.log("!!!!")
  }
}

export function pushColors(leds: RGBW[], ip: string) {
  const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
  if (isNaN(LED_PORT)) {
    throw Error(`Must define a DEVICE_PORT: ${LED_PORT}`)
  }

  let buff = makeLedCommand(leds)
  client.send(buff, LED_PORT, ip, (error) => {
    if (error) client.close()
  })
}

export interface PingResponse {
  ipOctlet: number
  numOfLeds: number
  macAddress: string
}

/**
 * Scanner helps scan an octlet to find devices on the network.
 *
 * The devices use UDP to communicate.  When pinging the devices, we
 * need to track the responses.
 */
export class Scanner {
  private _baseIp
  private _udpClient
  private _ipPromises: Map<number, [(res: PingResponse) => void, () => void]> =
    new Map()

  /**
   * Create a pinger, to help ping for new devices.
   * Since we use the UDP sockets vs TCP.
   *
   * @param baseOctlets the first 3 octlets of the ip address to scan
   */
  constructor(baseOctlets: string, udpClient: udp.Socket) {
    this._baseIp = baseOctlets
    this._udpClient = udpClient
  }

  async scan(): Promise<PingResponse[]> {
    const handler = this.handleMessage.bind(this)
    this._udpClient.addListener("message", handler)
    const ipRange = Array.from(Array(255).keys())
    const promises = ipRange.map((ipOctlet) => {
      return this.ping(ipOctlet)
    })

    let results = await Promise.allSettled(promises)
    this._udpClient.removeListener("message", handler)
    return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
  }

  async ping(ipOctlet: number) {
    const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
    if (isNaN(LED_PORT)) {
      throw Error(`Must define a DEVICE_PORT: ${LED_PORT}`)
    }

    const ip = `${this._baseIp}.${ipOctlet}`
    let buff = makePingCommand(ipOctlet)

    return new Promise<PingResponse>((resolve, reject) => {
      client.send(buff, LED_PORT, ip, (error) => {
        if (error) {
          console.log("ERROR pinging ip: ")
          client.close()
        }
      })

      setTimeout(() => {
        reject()
      }, 2000)

      this._ipPromises.set(ipOctlet, [resolve, reject])
    })
  }

  // This can be running when we send LED commands, we need to
  // filter them out.
  private handleMessage(msg: Buffer) {
    // TODO: Should we have devices echo back data?
    if (msg.length === 3) {
      // LED commands don't return meta data.
      return
    }

    console.log("====================")
    console.log("NEW DEVICE FOUND")
    console.log("====================")
    console.log(msg)

    if (msg.length < 2) {
      console.log("Error, expected larger message", msg)
      return
    }

    let ipOctlet = msg.readUInt16BE(0)
    let numOfLeds = msg.readUInt16BE(2)

    let macAddress = Array.from(msg)
      .slice(4)
      .map((byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2)
      })
      .join(":")

    let [resolve] = this._ipPromises.get(ipOctlet) || []
    if (resolve) {
      resolve({
        ipOctlet,
        numOfLeds,
        macAddress,
      })
    } else {
      console.error("Couldnt find resolver...")
    }
  }
}
