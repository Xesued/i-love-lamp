import udp from "dgram"
import type { RGBW } from "engine/types"
import { resolve } from "path"
import { makeLedCommand, makePingCommand } from "./devicecommands"

export const client = udp.createSocket("udp4")

export function buildColorSender(ip: string) {
  return (leds: RGBW[]) => {
    pushColors(leds, ip)
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

interface PingResponse {
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
    this._udpClient.addListener("message", this.handleMessage.bind(this))
  }

  async scan(): Promise<PingResponse[]> {
    const ipRange = Array.from(Array(255).keys())
    const promises = ipRange.map((ipOctlet) => {
      return this.ping(ipOctlet)
    })

    let results = await Promise.allSettled(promises)
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

  private handleMessage(msg: Buffer) {
    console.log("====================")
    console.log("NEW DEVICE FOUND")
    console.log("====================")

    if (msg.length < 2) {
      console.log("Error, expected larger message", msg)
      return
    }

    let ipOctlet = msg.readUInt16BE(0)
    let numOfLeds = msg.readUint16BE(2)

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
