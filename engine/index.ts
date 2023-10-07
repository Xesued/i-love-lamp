import type { ColorGeneratorFunc, LedMap, RGBW } from "./types"

/**
 * Color Engine
 *
 * Color animations are controlled by a list of generators
 * that let the engine know what leds need to be what color.
 *
 *
 */
export class ColorEngine {
  private _animations: Generator<LedMap>[] = []
  private _interval: any = null
  private _delayMs: number = 30
  private _numOfLeds: number
  private _blankLeds: RGBW[]

  constructor(leds: number) {
    this._numOfLeds = leds
    this._blankLeds = Array(leds).fill([0, 0, 0, 0])
  }

  addAnimation(animationFunc: ColorGeneratorFunc) {
    const animation = animationFunc({
      numOfLeds: this._numOfLeds,
      tickMs: this._delayMs,
    })
    this._animations.push(animation)
  }

  /**
   * Start creating the colors
   */
  run(cb: (colors: RGBW[]) => void) {
    this._interval = setInterval(() => {
      const start = Date.now()
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

      // Make sure to fill any wholes.
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
