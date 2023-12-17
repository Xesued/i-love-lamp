import {
  AnimationType,
  type AnimationItem,
  type ColorGeneratorFunc,
  type LedMap,
  type RGBW,
} from "./types"

export * from "./utils"

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

  // The colors for each sector if set.  Vs. animation
  private _solidColors: RGBW[] = []

  private _colorCollector: (leds: RGBW[]) => void

  constructor(numOfLeds: number, numberOfSectors: number = 1) {
    this._numOfLeds = numOfLeds
    this._solidColors = Array(this._numOfLeds).fill([0, 0, 0, 0])
    this._colorCollector = () => {}
  }

  setColorCollector(collector: (leds: RGBW[]) => void) {
    this._colorCollector = collector
  }

  /**
   * Sets the color
   * @param color The RGBW value to set the sector to
   * @param sector What sector to set the color for. 0 based
   */
  setSolidColor(color: RGBW, sector?: number) {
    this.stop()
    this._solidColors = this._solidColors.map(() => color)
    this._colorCollector(this._solidColors)
  }

  /**
   * Sets the color of individual leds
   *
   * @param color The RGBW value to set the sector to
   * @param sector What sector to set the color for.
   */
  setLedColor(leds: LedMap) {
    this.stop()
    Object.entries(leds).forEach(([ledIndex, ledColor]) => {
      this._solidColors[parseInt(ledIndex)] = ledColor
    })

    this._colorCollector(this._solidColors)
  }

  getColors() {
    return this._solidColors
  }

  addAnimationFunc(id: string, animationFunc: ColorGeneratorFunc) {
    const animation = animationFunc({
      numOfLeds: this._numOfLeds,
      tickMs: this._delayMs,
    })
    this._animations.set(id, animation)
    this.run()
  }

  addAnimation(animationGuid: string, animationDef: AnimationItem) {
    if (this._animations.has(animationGuid)) {
      return this.getAnimationGuids()
    }

    const colorFunc = ColorEngine.buildAnimation(animationDef, this._numOfLeds)
    if (colorFunc) this.addAnimationFunc(animationGuid, colorFunc)

    return this.getAnimationGuids()
  }

  removeAnimation(id: string) {
    this._animations.delete(id)
    return this.getAnimationGuids()
  }

  /**
   * Sets what animations to run on the device.  This will
   * clear out any existing animations
   *
   * @param animations The animations to run on this device
   */
  setAnimations(animations: Map<string, AnimationItem>) {
    // We don't want to reset animations already running. Find
    // what ones we need to clear.
    let currentAnimationGuids = Array.from(this._animations.keys())
    let newAnimationGuids = Array.from(animations.keys())
    currentAnimationGuids.forEach((c) => {
      if (!newAnimationGuids.includes(c)) this._animations.delete(c)
    })

    this._animations.clear()
    animations.forEach((animationDetails, guid) => {
      this.addAnimation(guid, animationDetails)
    })
  }

  /**
   * Gets the GUIDs for what animations have been
   * applied.
   *
   * @returns a list of animation GUIDs this device is running
   */
  getAnimationGuids(): string[] {
    return Array.from(this._animations.keys())
  }

  /**
   * Toggles the anmiation, then returns a list
   * of GUIDs for what animations are turned on
   *
   * @param animationGuid
   * @param animationDef
   */
  toggleAnimation(
    animationGuid: string,
    animationDef: AnimationItem
  ): string[] {
    if (this._animations.has(animationGuid)) {
      this._animations.delete(animationGuid)
      if (this._animations.size === 0) {
        this.setSolidColor([0, 0, 0, 0])
        this.stop()
      }
    } else {
      const colorFunc = ColorEngine.buildAnimation(
        animationDef,
        this._numOfLeds
      )
      if (colorFunc) this.addAnimationFunc(animationGuid, colorFunc)
    }

    return this.getAnimationGuids()
  }

  static buildAnimation(animationDef: AnimationItem, numOfLeds: number) {
    const leds = getLeds(animationDef.startLed, animationDef.endLed, numOfLeds)
    switch (animationDef.animationType) {
      case AnimationType.BLINK: {
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

      case AnimationType.RAINBOW: {
        return Animations.rainbow({
          leds,
          transitionMs: animationDef.transitionMs,
        })
      }

      default:
        return null
    }
  }

  run() {
    if (this._interval) {
      console.warn("Already running...")
      return
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
      const finalRGBW = this._solidColors.map((l, i) => {
        const rbgw = rgbwMap[i]
        if (rbgw) return rbgw
        return l
      })

      this._colorCollector(finalRGBW)
    }, this._delayMs)
  }

  stop() {
    if (this._interval) clearInterval(this._interval)
    this._interval = null
  }
}
