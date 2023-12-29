import type {
  RGBW,
  ColorGeneratorOptions,
  ColorGeneratorFunc,
  LedMap,
} from "../types"

type RainbowOptions = {
  /**
   * The index of the LEDs we want to control
   */
  readonly leds: number[]

  /*  /**
   * How long do you want to transition to on/off?
   *
   * Default: 100ms
   */
  transitionMs?: number
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number) {
  var r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

export function rainbow(opts: RainbowOptions): ColorGeneratorFunc {
  const { leds, transitionMs = 100 } = opts
  const hueChangePerTick = 0.01

  // Sort, just incase.
  const sortedLeds = [...leds].sort((a, b) => {
    if (a > b) return 1
    else if (a < b) return -1
    return 0
  })
  console.log("sorted leds: ", sortedLeds)

  let currentHueValue = 0
  let currentValues: LedMap = sortedLeds.reduce((acc, l) => {
    acc[l] = [0, 0, 0, 0]
    return acc
  }, {} as LedMap)

  function* rainbowGen(colorGenOpts: ColorGeneratorOptions) {
    const { tickMs } = colorGenOpts
    while (true) {
      currentHueValue += hueChangePerTick
      if (currentHueValue > 1) currentHueValue = 0
      const rgb = hslToRgb(currentHueValue, 1, 0.2)
      const newRGBValue: RGBW = [
        Math.floor(rgb[0]),
        Math.floor(rgb[1]),
        Math.floor(rgb[2]),
        0,
      ]

      // Shift all of the values up.

      // let ledIndexes = Object.keys(currentValues.keys())
      // let minIndex = ledIndexes[0]
      // let maxIndex = ledIndexes[]
      currentValues = sortedLeds.reduce((acc, l, i) => {
        if (i === 0) {
          // Ignore the first LED, we replace it later.
          return acc
        }

        // All other leds get shifted up.
        const prevLed = sortedLeds[i - 1]
        acc[l] = currentValues[prevLed]

        return acc
      }, {} as LedMap)

      currentValues[sortedLeds[0]] = newRGBValue

      yield currentValues
    }
  }

  return rainbowGen
}
