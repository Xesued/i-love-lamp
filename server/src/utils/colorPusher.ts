import udp from "dgram"
import type { RGBW } from "engine/types"

const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
const client = udp.createSocket("udp4")

export function buildColorSender(maxLeds: number, ip: string) {
  if (isNaN(LED_PORT)) {
    throw Error(`Must define a DEVICE_PORT: ${process.env.LAMP_DEVICE_PORT}`)
  }

  return (leds: RGBW[]) => {
    let buff = Buffer.alloc(maxLeds * 4)
    leds.forEach((led, i) => {
      // buff.set([led[0], led[1], led[2], led[3]], i * 4)
      buff.set(led, i * 4)
    })

    client.send(buff, LED_PORT, ip, (error) => {
      if (error) client.close()
    })
  }
}
