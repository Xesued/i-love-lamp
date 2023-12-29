import { Button, Input } from "@material-tailwind/react"
import convert from "color-convert"
import { AnimationType, BounceAnimation } from "engine/types"
import { rgbToRgbw, rgbwToRgb } from "engine/utils"
import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"
import { IAnimationNew } from "../../api/lampApi"
import { ColorPickerInput } from "../ColorPickerInput"

type BounceFormProps = {
  name?: string
  bounceOpts?: BounceAnimation
  onSubmit: (opts: IAnimationNew) => void
}

type BounceFormOpts = {
  color: string
  name: string
  speed: string
  endLed: string
  startLed: string
}

export function EditBounceAnimation(props: BounceFormProps) {
  const { onSubmit, name, bounceOpts } = props

  const [opts, setOpts] = useState<BounceFormOpts>({
    color: convert.rgb.hex([...rgbwToRgb(bounceOpts?.color || [0, 0, 0, 0])]),
    name: name || "",
    speed: "" + bounceOpts?.speed,
    endLed: "" + bounceOpts?.endLed,
    startLed: "" + bounceOpts?.startLed,
  })

  useEffect(() => {
    if (bounceOpts) {
      setOpts({
        color: convert.rgb.hex([
          ...rgbwToRgb(bounceOpts?.color || [0, 0, 0, 0]),
        ]),
        name: name || "",
        speed: "" + bounceOpts?.speed,
        endLed: "" + bounceOpts?.endLed,
        startLed: "" + bounceOpts?.startLed,
      })
    }
  }, [bounceOpts])

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

  const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const speedStr = event.currentTarget.value
    const speed = parseInt(speedStr)
    if (speedStr === "" || !isNaN(speed)) {
      setOpts({
        ...opts,
        speed: speedStr,
      })
    }
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
    const bounceOpts: BounceAnimation = {
      type: AnimationType.BOUNCE,
      color: rgbToRgbw(convert.hex.rgb(opts.color)),
      speed: parseInt(opts.speed),
      endLed: parseInt(opts.endLed),
      startLed: parseInt(opts.startLed),
    }

    onSubmit({
      name: opts.name,
      details: bounceOpts,
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
        label="Speed"
        value={opts.speed}
        onChange={handleSpeedChange}
        crossOrigin={undefined}
      ></Input>
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
        {bounceOpts ? "Edit" : "Add"} Animation
      </Button>
    </div>
  )
}
