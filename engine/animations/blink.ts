import type {
  RGBW,
  ColorGeneratorOptions,
  ColorGeneratorFunc,
  LedMap,
} from "../types"

type BlinkOptions = {
  /**
   * The index of the LEDs we want to control
   */
  readonly leds: number[]

  /**
   * The on color
   */
  readonly onColor: RGBW
  onDurationMs: number

  /**
   * Defaults [0,0,0,0]
   */
  readonly offColor?: RGBW
  offDurationMs: number

  /**
   * How long do you want to transition to on/off?
   *
   * Default: 100ms
   */
  transitionMs?: number
}

enum BLINK_STATE {
  ON,
  OFF,
  TRANSITION_ON,
  TRANSITION_OFF,
}

export function blink(opts: BlinkOptions): ColorGeneratorFunc {
  const {
    onColor,
    onDurationMs,
    offColor = [0, 0, 0, 0],
    offDurationMs,
    leds,
    transitionMs = 100,
  } = opts
  let duration = 0
  // We start by transitioning to ON
  let state: BLINK_STATE = BLINK_STATE.TRANSITION_ON

  let currentValues: LedMap = leds.reduce((acc, l) => {
    acc[l] = [...offColor]
    return acc
  }, {} as LedMap)

  function* blinkGen(colorGenOpts: ColorGeneratorOptions) {
    const { tickMs } = colorGenOpts
    const tickAmt = getTickAmount(transitionMs, tickMs, offColor, onColor)
    while (true) {
      duration += tickMs
      switch (state) {
        case BLINK_STATE.TRANSITION_ON: {
          currentValues = leds.reduce((acc, l) => {
            const color = currentValues[l]
            if (!color) return acc
            acc[l] = [
              bound(color[0], tickAmt[0], onColor[0]),
              bound(color[1], tickAmt[1], onColor[1]),
              bound(color[2], tickAmt[2], onColor[2]),
              bound(color[3], tickAmt[3], onColor[3]),
            ]
            return acc
          }, {} as LedMap)

          const led1 = currentValues[leds[0]]
          if (!led1) break

          if (ledEq(led1, onColor)) {
            state = BLINK_STATE.ON
            duration = 0
          }
          break
        }
        case BLINK_STATE.ON:
          if (duration >= onDurationMs) {
            state = BLINK_STATE.TRANSITION_OFF
            duration = 0
          }
          break

        case BLINK_STATE.TRANSITION_OFF: {
          currentValues = leds.reduce((acc, l) => {
            const color = currentValues[l]
            if (!color) return acc
            acc[l] = [
              bound(color[0], -tickAmt[0], offColor[0]),
              bound(color[1], -tickAmt[1], offColor[1]),
              bound(color[2], -tickAmt[2], offColor[2]),
              bound(color[3], -tickAmt[3], offColor[3]),
            ]
            return acc
          }, {} as LedMap)
          const led1 = currentValues[leds[0]]
          if (!led1) break

          const fullyOff = ledEq(led1, offColor)
          if (fullyOff) {
            state = BLINK_STATE.OFF
            duration = 0
          }
          break
        }

        case BLINK_STATE.OFF:
          if (duration >= offDurationMs) {
            state = BLINK_STATE.TRANSITION_ON
            duration = 0
          }
          break

        default:
          console.error("Unknown state")
      }
      yield currentValues
    }
  }

  return blinkGen
}

/**
 * Returns an RGBW that is the tick amounts we
 * need to do.
 *
 * @param dur totalDuration we need
 * @param tickMs
 */
function getTickAmount(
  transitionMs: number,
  msPerTick: number,
  startColor: RGBW,
  endColor: RGBW
) {
  const ticksNeeded = transitionMs / msPerTick
  return [
    Math.ceil((endColor[0] - startColor[0]) / ticksNeeded),
    Math.ceil((endColor[1] - startColor[1]) / ticksNeeded),
    Math.ceil((endColor[2] - startColor[2]) / ticksNeeded),
    Math.ceil((endColor[3] - startColor[3]) / ticksNeeded),
  ]
}

/**
 * Bind the function to the upper bound.
 *
 */
function bound(start: number, inc: number, b: number) {
  const newVal = start + inc
  if (inc < 0) {
    // we are growing "down".
    return newVal < b ? b : newVal
  }

  // We are growing "up"
  return newVal > b ? b : newVal
}

function ledEq(led1: RGBW, led2: RGBW) {
  return (
    led1[0] === led2[0] &&
    led1[1] === led2[1] &&
    led1[2] === led2[2] &&
    led1[3] === led2[3]
  )
}
