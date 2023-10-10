export type RGB = [number, number, number]
export type RGBW = [number, number, number, number]

export type ColorGeneratorOptions = {
  // The number of milliseconds between ticks
  tickMs: number
  // How many LEDs are configured in the engine
  numOfLeds: number
}

export type LedMap = { [index: number]: RGBW }
export type ColorGeneratorFunc = (
  opts: ColorGeneratorOptions
) => Generator<LedMap>

export enum AnimationType {
  BLINK = "Blink",
  BOUNCE = "Bounce",
  SOLID = "Solid",
}

export interface Animation {
  id: string
  name: string
  type: AnimationType
  startLed?: number
  endLed?: number
}

export interface BlinkAnimation extends Animation {
  type: AnimationType.BLINK
  onColor: RGBW
  onDuration: number
  offColor: RGBW
  offDuration: number
  transition: number
}

export interface BounceAnimation extends Animation {
  type: AnimationType.BOUNCE
  color: RGBW
  speed: number
}

export interface SolidAnimation extends Animation {
  type: AnimationType.SOLID
  color: RGBW
}

export type AnimationItem = BlinkAnimation | BounceAnimation | SolidAnimation
