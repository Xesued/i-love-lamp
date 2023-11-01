import { useEffect, useState } from "react"

import { Slider, Typography } from "@material-tailwind/react"
import { RGBW } from "engine/types"
import { ColorResult, HuePicker } from "react-color"

interface ColorPickerProps {
  onChange: (color: RGBW) => void
}

const MAX_BRIGHTNESS = 255

export function ColorPicker(props: ColorPickerProps) {
  const { onChange } = props
  const [brightness, setBrightness] = useState(50)
  const [whiteBrightness, setWhiteBrightness] = useState(50)
  const [color, setColor] = useState<RGBW>([
    MAX_BRIGHTNESS,
    MAX_BRIGHTNESS,
    MAX_BRIGHTNESS,
    0,
  ])

  useEffect(() => {
    const brightnessPercentage = brightness / 100
    const colorToUse: RGBW =
      brightness === 0
        ? [0, 0, 0, 0]
        : [
            Math.floor(color[0] * brightnessPercentage),
            Math.floor(color[1] * brightnessPercentage),
            Math.floor(color[2] * brightnessPercentage),
            0, // White handled below
          ]
    colorToUse[3] = Math.floor(MAX_BRIGHTNESS * (whiteBrightness / 100))
    onChange(colorToUse)
  }, [color, brightness, whiteBrightness])

  const handleRgbChange = (newColor: ColorResult) => {
    const rgb = newColor.rgb
    setColor([rgb.r, rgb.g, rgb.b, color[3]])
  }

  const handleRgbBrightness = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const numValue = parseInt(value, 10)
    setBrightness(numValue)
  }

  const handleWhiteUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const numValue = parseInt(value, 10)
    setWhiteBrightness(numValue)
  }

  return (
    <div>
      <HuePicker
        color={{ r: color[0], g: color[1], b: color[2] }}
        onChange={handleRgbChange}
      />
      <Typography>Brightness</Typography>
      <Slider value={brightness} onChange={handleRgbBrightness} />

      <Typography>White Brightness</Typography>
      <Slider value={whiteBrightness} onChange={handleWhiteUpdate} />
    </div>
  )
}
