import { Typography } from "@material-tailwind/react"
import { CirclePicker } from "react-color"
import type { ColorChangeHandler } from "react-color"

type ColorPickerInputProps = {
  onChange: (hex: string) => void
  label: string
  value: string
}

export function ColorPickerInput(props: ColorPickerInputProps) {
  const { onChange, label, value } = props

  const handleColorChange: ColorChangeHandler = (color) => {
    console.log(color)
    onChange(color.hex)
  }

  return (
    <div className="flex justify-start gap-3">
      <Typography>{label}</Typography>
      <CirclePicker color={value} onChangeComplete={handleColorChange} />
      <div className="w-10 border-2" style={{ backgroundColor: value }}></div>
    </div>
  )
}
