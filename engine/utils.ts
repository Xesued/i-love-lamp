import type { RGB, RGBW } from "./types"

export function rgbToRgbw(rgb: RGB, white?: number): RGBW {
  return [rgb[0], rgb[1], rgb[2], white || 0]
}

export function rgbwToRgb(rgbw: RGBW): RGB {
  return [rgbw[0], rgbw[1], rgbw[2]]
}
