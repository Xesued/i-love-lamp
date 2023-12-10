import { RGBW } from "engine/types"
import { useState } from "react"

import { RgbaColor, RgbaColorPicker } from "react-colorful"

interface ColorPickerProps {
  color: RGBW
  onChange: (color: RGBW) => void
}

export function ColorPicker(props: ColorPickerProps) {
  const { onChange } = props

  const [newColor, setNewColor] = useState<RgbaColor>({
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  })

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
    </div>
  )
}
