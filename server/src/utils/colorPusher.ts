import udp from "dgram"
import type { RGBW } from "engine/types"

const client = udp.createSocket("udp4")

const COMMAND_META_BYTE_SIZE = 3

export function buildColorSender(ip: string) {
  // const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
  // if (isNaN(LED_PORT)) {
  //   throw Error(`Must define a DEVICE_PORT: ${LED_PORT}`)
  // }

  return (leds: RGBW[]) => {
    pushColors(leds, ip)
    // let buff = Buffer.alloc(maxLeds * 4 + COMMAND_META_BYTE_SIZE)

    // // TODO: Make this an enum of sorts? buff.set([COMMANDS.SET_LEDS])
    // buff.set([2], 0) // LED Command
    // buff.writeUInt16BE(0) // We don't care about message ids for LEDs

    // leds.forEach((led, i) => {
    //   buff.set(led, i * 4 + COMMAND_META_BYTE_SIZE)
    // })

    // client.send(buff, LED_PORT, ip, (error) => {
    //   if (error) client.close()
    // })
  }
}

export function pushColors(leds: RGBW[], ip: string) {
  const LED_PORT = parseInt(process.env.LAMP_DEVICE_PORT || "", 10)
  if (isNaN(LED_PORT)) {
    throw Error(`Must define a DEVICE_PORT: ${LED_PORT}`)
  }

  let buff = Buffer.alloc(leds.length * 4 + COMMAND_META_BYTE_SIZE)
  console.log("SENDING BUFF...")
  buff.set([2], 0) // LED Command
  buff.writeUInt16BE(0, 1) // We don't care about message ids for LEDs

  leds.forEach((led, i) => {
    buff.set(led, i * 4 + COMMAND_META_BYTE_SIZE)
  })

  client.send(buff, LED_PORT, ip, (error) => {
    if (error) client.close()
  })
}
