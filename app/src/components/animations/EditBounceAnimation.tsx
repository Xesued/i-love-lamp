import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { AnimationType, BounceAnimation } from "engine/types"
import { rgbToRgbw, rgbwToRgb } from "engine/utils"
import { Button, Input } from "@material-tailwind/react"
import convert from "color-convert"
import { v1 as uuidv1 } from "uuid"
import { ColorPickerInput } from "../ColorPickerInput"

type BounceFormProps = {
  // If we are editing, supply a bounce object
  bounceToEdit?: BounceAnimation
  onSubmit: (opts: BounceAnimation) => void
}

type BounceFormOpts = {
  color: string
  name: string
  id: string
  speed: number
  endLed?: number
  startLed?: number
}

export function EditBounceAnimation(props: BounceFormProps) {
  const { onSubmit, bounceToEdit } = props

  const [opts, setOpts] = useState<BounceFormOpts>({
    color: "",
    id: uuidv1(),
    name: "",
    speed: 100,
    endLed: undefined,
    startLed: undefined,
  })

  useEffect(() => {
    if (bounceToEdit) {
      setOpts({
        id: bounceToEdit.id,
        name: bounceToEdit.name,
        color: convert.rgb.hex(rgbwToRgb(bounceToEdit.color)),
        speed: bounceToEdit.speed,
        endLed: bounceToEdit.endLed,
        startLed: bounceToEdit.endLed,
      })
    }
  }, [bounceToEdit])

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
    const speed = parseInt(event.currentTarget.value)
    setOpts({
      ...opts,
      speed: isNaN(speed) ? 0 : speed,
    })
  }

  const handleEndLedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const endLed = parseInt(event.currentTarget.value)
    setOpts({
      ...opts,
      endLed: isNaN(endLed) ? undefined : endLed,
    })
  }

  const handleStartLedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const startLed = parseInt(event.currentTarget.value)
    setOpts({
      ...opts,
      startLed: isNaN(startLed) ? undefined : startLed,
    })
  }

  const handleAdd = () => {
    // TODO: more validate
    const bounceOpts: BounceAnimation = {
      id: opts.id,
      name: opts.name,
      color: rgbToRgbw(convert.hex.rgb(opts.color)),
      speed: opts.speed,
      type: AnimationType.BOUNCE,
      endLed: opts.endLed,
      startLed: opts.startLed,
    }

    onSubmit(bounceOpts)
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
        {bounceToEdit ? "Edit" : "Add"} Animation
      </Button>
    </div>
  )
}
