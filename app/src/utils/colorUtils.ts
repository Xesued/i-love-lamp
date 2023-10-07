import convert from "color-convert"
import { RGBW } from "engine/types"

// TODO: Move to engine?
export function ledToRGB(led: RGBW) {
  return `#${convert.rgb.hex(led[0], led[1], led[2])}`
}