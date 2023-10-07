import type {
  RGBW,
  ColorGeneratorOptions,
  ColorGeneratorFunc,
  LedMap,
} from "../types"

type SolidOptions = {
  /**
   * The index of the LEDs we want to control
   */
  readonly leds: number[]

  /**
   * The on color
   */
  readonly color: RGBW

  /**
   * Function to update what LEDs we want to control.
   * Useful if you want to make a meter based on other input.
   *
   * @returns list of leds to change color
   */
  updateLeds?: () => number[]

  /**
   * How long do you want to transition to the solid color?
   *
   * Default: 100ms
   */
  transitionMs?: number
}

export function solid(opts: SolidOptions): ColorGeneratorFunc {
  const { color, leds, updateLeds } = opts
  let coloredLeds = getColoredLeds(leds, color)
  function* solidGenFunc(_engineOpts: ColorGeneratorOptions) {
    coloredLeds = getColoredLeds(leds, color)
    while (true) {
      if (updateLeds) coloredLeds = getColoredLeds(updateLeds(), color)
      yield coloredLeds
    }
  }

  return solidGenFunc
}

function getColoredLeds(leds: number[], color: RGBW): LedMap {
  return leds.reduce((acc, l) => {
    acc[l] = [...color]
    return acc
  }, {} as LedMap)
}
