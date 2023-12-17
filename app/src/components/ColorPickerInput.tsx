import { Typography } from "@material-tailwind/react"

type ColorPickerInputProps = {
  onChange: (hex: string) => void
  label: string
  value: string
}

export function ColorPickerInput(props: ColorPickerInputProps) {
  const { label, value } = props

  return (
    <div className="flex justify-start gap-3">
      <Typography>{label}</Typography>
      <div className="w-10 border-2" style={{ backgroundColor: value }}></div>
    </div>
  )
}
