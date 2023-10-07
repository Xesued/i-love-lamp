import udp from "dgram"
import type { RGBW } from "engine/types"

const LED_IP = "192.168.12"
const LED_PORT = 50222
const client = udp.createSocket("udp4")

export function buildColorSender(maxLeds: number, ip: number) {
  let fullIp = `${LED_IP}.${ip}`
  return (leds: RGBW[]) => {
    let buff = Buffer.alloc(maxLeds * 4)
    leds.forEach((led, i) => {
      buff.set([led[0], led[1], led[2], led[3]], i * 4)
      // buff.set(led, i * 4)
    })

    client.send(buff, LED_PORT, fullIp, (error) => {
      if (error) client.close()
    })
  }
}
