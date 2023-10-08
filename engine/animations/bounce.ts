import { ColorGeneratorFunc } from "../types"
import { solid, type SolidOptions } from "./solid"

type BounceOptions = Omit<SolidOptions, "updateLeds" | "leds"> & {
  startLed: number
  endLed: number
  speed: number
}

/**
 * Bounce is just solid that moves what LEDs it controls.
 *
 * @param opts
 * @returns
 */
export function bounce(opts: BounceOptions): ColorGeneratorFunc {
  const { speed, startLed, endLed, ...rest } = opts
  const updateLeds = bouncer(speed, startLed, endLed)
  return solid({
    ...rest,
    leds: [],
    updateLeds,
  })
}

function bouncer(delay: number, startLed: number, endLed: number) {
  let upDown = 1
  let solidLed = startLed
  let solidLeds: number[] = []
  setInterval(() => {
    if (upDown === 1) {
      if (solidLed + 1 > endLed) {
        // At the top... go back down
        upDown = 0
        solidLed--
      } else {
        solidLed++
      }
    } else {
      if (solidLed - 1 < startLed) {
        // At the bottom... go back up
        upDown = 1
        solidLed++
      } else {
        solidLed--
      }
    }
    solidLeds = [
      Math.max(solidLed - 1, startLed),
      solidLed,
      Math.min(solidLed + 1, endLed - 1),
    ]
  }, delay)

  return () => solidLeds
}
