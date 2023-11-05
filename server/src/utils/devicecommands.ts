import type { RGBW } from "engine/types"

const COMMAND_META_BYTE_SIZE = 3
const LED_SIZE = 4

/**
 * Sends a command to the device to change
 * the LEDs to the given colors
 *
 * @param leds The RGBW leds to send
 * @returns buffer with the command and LEDs to set
 */
export function makeLedCommand(leds: RGBW[]) {
  let buff = Buffer.alloc(leds.length * LED_SIZE + COMMAND_META_BYTE_SIZE)
  buff.set([2], 0) // LED Command
  buff.writeUInt16BE(0, 1) // We don't care about message ids for LEDs

  leds.forEach((led, i) => {
    buff.set(led, i * 4 + COMMAND_META_BYTE_SIZE)
  })

  return buff
}

/**
 * Pings the device to see if it's still alive.
 *
 * @param id The id you want echoed back
 * @returns buffer of the command to send a ping to the device
 */
export function makePingCommand(id: number) {
  let buff = Buffer.alloc(COMMAND_META_BYTE_SIZE)
  buff.set([1], 0) // Ping Command
  buff.writeUInt16BE(id, 1)
  return buff
}
