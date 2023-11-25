import convert from "color-convert"
import { RGBW } from "engine/types"

type LampProps = {
  colors: RGBW[]
}

const BASE_WIDTH = 6
const TOWER_WIDTH = BASE_WIDTH * 3
const LED_SIZE = 4
const SHADOW_SIZE = 4

export const Lamp = ({ colors }: LampProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex flex-col justify-center items-center bg-black"
        style={{ width: TOWER_WIDTH }}
      >
        <div
          className="bg-black"
          style={{ width: TOWER_WIDTH, height: BASE_WIDTH }}
        ></div>
        <div
          className="white-strip bg-white overflow-hidden"
          style={{ width: BASE_WIDTH }}
        >
          <div className="flex flex-col-reverse gap-1 items-center justify-around">
            {colors.map((c, i) => (
              <div
                key={i}
                className="led"
                style={{
                  width: LED_SIZE,
                  height: LED_SIZE,
                  backgroundColor: `#${convert.rgb.hex([c[0], c[1], c[2]])}`,
                  boxShadow: `0 0 ${SHADOW_SIZE}px ${SHADOW_SIZE}px #${convert.rgb.hex(
                    [c[0], c[1], c[2]],
                  )}`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="bg-black"
        style={{ width: TOWER_WIDTH * 2, height: BASE_WIDTH }}
      ></div>
    </div>
  )
}
