import {
  AnimationType,
  type AnimationItem,
  type ColorGeneratorFunc,
  type LedMap,
  type RGBW,
} from "./types"

import * as Animations from "./animations"

function getLeds(
  start: number | undefined,
  end: number | undefined,
  numOfLeds: number
) {
  const first = start ? start : 0
  const last = Math.min(numOfLeds - 1, end ? end : numOfLeds - 1)
  const maxList = Array.from(Array(numOfLeds).keys())
  return maxList.slice(first, last)
}

/**
 * Color Engine
 *
 * Color animations are controlled by a list of generators
 * that let the engine know what leds need to be what color.
 *
 */
export class ColorEngine {
  private _numOfLeds: number
  private _animations: Map<string, Generator<LedMap>> = new Map()
  private _interval: any = null
  private _delayMs: number = 32
  private _blankLeds: RGBW[]

  constructor(numOfLeds: number) {
    this._numOfLeds = numOfLeds
    this._blankLeds = Array(this._numOfLeds).fill([0, 0, 0, 0])
  }

  addAnimation(id: string, animationFunc: ColorGeneratorFunc) {
    const animation = animationFunc({
      numOfLeds: this._numOfLeds,
      tickMs: this._delayMs,
    })
    this._animations.set(id, animation)
  }

  removeAnimation(id: string) {
    this._animations.delete(id)
  }

  static buildAnimation(animationDef: AnimationItem, numOfLeds: number) {
    switch (animationDef.animationType) {
      case AnimationType.BLINK: {
        const leds = getLeds(
          animationDef.startLed,
          animationDef.endLed,
          numOfLeds
        )
        return Animations.blink({
          leds,
          offDurationMs: animationDef.offDuration,
          offColor: animationDef.offColor,
          onColor: animationDef.onColor,
          onDurationMs: animationDef.onDuration,
          transitionMs: animationDef.transition,
        })
      }

      case AnimationType.BOUNCE: {
        return Animations.bounce({
          startLed: animationDef.startLed || 0,
          endLed: animationDef.endLed || numOfLeds - 1,
          speed: animationDef.speed,
          color: animationDef.color,
        })
      }

      case AnimationType.SOLID: {
        return Animations.solid({
          leds: getLeds(0, numOfLeds - 1, numOfLeds),
          color: animationDef.color,
        })
      }

      default:
        return null
    }
  }

  run(cb: (colors: RGBW[]) => void) {
    if (this._interval) {
      console.warn("Already running...")
    }

    this._interval = setInterval(() => {
      const rgbwMap: LedMap = {}
      this._animations.forEach((a) => {
        const { value, done } = a.next()
        if (!done) {
          Object.keys(value).forEach((k) => {
            const key = parseInt(k)
            rgbwMap[key] = value[key]
          })
        }
      })

      // Make sure to fill any holes.
      const finalRGBW = this._blankLeds.map((l, i) => {
        const rbgw = rgbwMap[i]
        if (rbgw) return rbgw
        return l
      })

      cb(finalRGBW)
    }, this._delayMs)
  }

  stop() {
    if (this._interval) clearInterval(this._interval)
    this._interval = null
  }
}
