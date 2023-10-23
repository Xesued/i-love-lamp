import { useCallback, useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { AnimationType, BlinkAnimation } from "engine/types"
import { rgbToRgbw, rgbwToRgb } from "engine/utils"
import { Button, Input } from "@material-tailwind/react"
import convert from "color-convert"
import { ColorPickerInput } from "../ColorPickerInput"
import { IAnimationNew } from "../../api/lampApi"

type BlinkFormProps = {
  name?: string
  blinkOpts?: BlinkAnimation
  onSubmit: (opts: IAnimationNew) => void
}

type BlinkFormOpts = {
  onColor: string
  offColor: string
  onDuration: string
  offDuration: string
  name: string
  transition: string
  endLed: string
  startLed: string
}

export function EditBlinkAnimation(props: BlinkFormProps) {
  const { onSubmit, name, blinkOpts } = props

  const [opts, setOpts] = useState<BlinkFormOpts>({
    onColor: "",
    offColor: "",
    onDuration: "",
    offDuration: "",
    transition: "",
    name: "",
    endLed: "",
    startLed: "",
  })

  useEffect(() => {
    if (blinkOpts) {
      setOpts({
        onColor: convert.rgb.hex([
          ...rgbwToRgb(blinkOpts?.onColor || [0, 0, 0, 0]),
        ]),
        offColor: convert.rgb.hex([
          ...rgbwToRgb(blinkOpts?.offColor || [0, 0, 0, 0]),
        ]),
        onDuration: "" + blinkOpts.onDuration,
        offDuration: "" + blinkOpts.offDuration,
        transition: "" + blinkOpts.transition,
        name: name || "",
        endLed: "" + blinkOpts?.endLed,
        startLed: "" + blinkOpts?.startLed,
      })
    }
  }, [blinkOpts])

  // Makes sure we don't enter non number into a text input for a form
  // that should just be numbers.
  const setStringValueOfNumberField =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value
      const numValue = parseInt(value)
      if (value === "" || !isNaN(numValue)) {
        setOpts({
          ...opts,
          [key]: value,
        })
      }
    }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    setOpts({
      ...opts,
      name,
    })
  }

  const handleOnColorChange = (onColor: string) => {
    setOpts({
      ...opts,
      onColor,
    })
  }

  const handleOffColorChange = (offColor: string) => {
    setOpts({
      ...opts,
      offColor,
    })
  }

  const handleAdd = () => {
    const newBlinkOpts: BlinkAnimation = {
      animationType: AnimationType.BLINK,
      onColor: rgbToRgbw(convert.hex.rgb(opts.onColor)),
      offColor: rgbToRgbw(convert.hex.rgb(opts.offColor)),
      onDuration: parseInt(opts.onDuration),
      offDuration: parseInt(opts.offDuration),
      transition: parseInt(opts.transition),
      endLed: parseInt(opts.endLed),
      startLed: parseInt(opts.startLed),
    }

    onSubmit({
      name: opts.name,
      details: newBlinkOpts,
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
        label="On Color"
        value={opts.onColor}
        onChange={handleOnColorChange}
      />
      <Input
        label="On Duration"
        value={opts.onDuration}
        onChange={setStringValueOfNumberField("onDuration")}
        crossOrigin={undefined}
      ></Input>
      <ColorPickerInput
        label="Off Color"
        value={opts.offColor}
        onChange={handleOffColorChange}
      />
      <Input
        label="Off Duration"
        value={opts.offDuration}
        onChange={setStringValueOfNumberField("offDuration")}
        crossOrigin={undefined}
      ></Input>
      <Input
        label="Tranistion Time"
        value={opts.transition}
        onChange={setStringValueOfNumberField("transition")}
        crossOrigin={undefined}
      ></Input>
      <Input
        label="Start Led"
        value={opts?.startLed}
        onChange={setStringValueOfNumberField("startLed")}
        crossOrigin={undefined}
      ></Input>
      <Input
        label="End Led"
        value={opts?.endLed}
        onChange={setStringValueOfNumberField("endLed")}
        crossOrigin={undefined}
      ></Input>
      <Button color="blue" onClick={handleAdd}>
        {blinkOpts ? "Edit" : "Add"} Animation
      </Button>
    </div>
  )
}
