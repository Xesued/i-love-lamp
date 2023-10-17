import udp from "dgram"
import type { RGBW } from "engine/types"

const client = udp.createSocket("udp4")

export function buildColorSender(maxLeds: number, ip: string) {
  const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
  if (isNaN(LED_PORT)) {
    throw Error(`Must define a DEVICE_PORT: ${LED_PORT}`)
  }

  return (leds: RGBW[]) => {
    let buff = Buffer.alloc(maxLeds * 4)
    leds.forEach((led, i) => {
      buff.set(led, i * 4)
    })

    client.send(buff, LED_PORT, ip, (error) => {
      if (error) client.close()
    })
  }
}
