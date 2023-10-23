import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { AnimationType, SolidAnimation } from "engine/types"
import { rgbToRgbw, rgbwToRgb } from "engine/utils"
import { Button, Input } from "@material-tailwind/react"
import convert from "color-convert"
import { ColorPickerInput } from "../ColorPickerInput"
import { IAnimationNew } from "../../api/lampApi"

type EditSolidAnimationProps = {
  name?: string
  solidOpts?: SolidAnimation
  onSubmit: (opts: IAnimationNew) => void
}

/**
 * The Form state for solid animation options
 *
 */
type SolidFormOpts = {
  name: string
  color: string
  endLed: string
  startLed: string
}

export function EditSolidAnimation(props: EditSolidAnimationProps) {
  const { onSubmit, name, solidOpts } = props
  const [opts, setOpts] = useState<SolidFormOpts>({
    color: "",
    name: "",
    endLed: "",
    startLed: "",
  })

  useEffect(() => {
    if (solidOpts) {
      setOpts({
        color: convert.rgb.hex([
          ...rgbwToRgb(solidOpts?.color || [0, 0, 0, 0]),
        ]),
        name: name || "",
        endLed: "" + solidOpts?.endLed,
        startLed: "" + solidOpts?.startLed,
      })
    }
  }, [solidOpts])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    setOpts({
      ...opts,
      name,
    })
  }

  const handleColorChange = (color: string) => {
    setOpts({
      ...opts,
      color,
    })
  }

  const handleEndLedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const endStr = event.currentTarget.value
    const endLed = parseInt(event.currentTarget.value)
    if (endStr === "" || !isNaN(endLed)) {
      setOpts({
        ...opts,
        endLed: endStr,
      })
    }
  }

  const handleStartLedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const startStr = event.currentTarget.value
    const startLed = parseInt(startStr)
    if (startStr === "" || !isNaN(startLed)) {
      setOpts({
        ...opts,
        startLed: startStr,
      })
    }
  }

  const handleAdd = () => {
    const solidOpts: SolidAnimation = {
      animationType: AnimationType.SOLID,
      color: rgbToRgbw(convert.hex.rgb(opts.color)),
      endLed: parseInt(opts.endLed),
      startLed: parseInt(opts.startLed),
    }

    onSubmit({
      name: opts.name,
      details: solidOpts,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Name"
        value={opts.name}
        onChange={handleNameChange}
        crossOrigin={undefined}
      ></Input>
      <ColorPickerInput
        label="Color"
        value={opts.color}
        onChange={handleColorChange}
      />
      <Input
        label="Start Led"
        value={opts?.startLed}
        onChange={handleStartLedChange}
        crossOrigin={undefined}
      ></Input>
      <Input
        label="End Led"
        value={opts?.endLed}
        onChange={handleEndLedChange}
        crossOrigin={undefined}
      ></Input>
      <Button color="blue" onClick={handleAdd}>
        {solidOpts ? "Edit" : "Add"} Animation
      </Button>
    </div>
  )
}
