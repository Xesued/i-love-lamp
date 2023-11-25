import { RGBW } from "engine/types"
import { useState } from "react"

import { RgbaColor, RgbaColorPicker } from "react-colorful"

interface ColorPickerProps {
  color: RGBW
  onChange: (color: RGBW) => void
}

export function ColorPicker(props: ColorPickerProps) {
  const { color, onChange } = props

  const [newColor, setNewColor] = useState<RgbaColor | undefined>()

  const handleChange = (colorResult: RgbaColor) => {
    setNewColor(colorResult)
    const { r, g, b, a } = colorResult

    // For our purpose, the Alpha is for our white light channel.
    const whiteChannel = a * 255
    onChange([r, g, b, whiteChannel])
  }

  return (
    <div>
      <RgbaColorPicker color={newColor} onChange={handleChange} />
      {/* <HuePicker
        color={{ r: color[0], g: color[1], b: color[2] }}
        onChange={handleRgbChange}
      />
      <Typography>Brightness</Typography>
      <Slider
        value={brightness}
        onChange={handleRgbBrightness}
        max={100}
        min={0}
      />

      <Typography>White Brightness</Typography>
      <Slider
        value={whiteBrightness}
        onChange={handleWhiteUpdate}
        max={255}
        min={0}
      /> */}
    </div>
  )
}
