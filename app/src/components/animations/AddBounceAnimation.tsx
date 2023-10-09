import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { AnimationType, BounceAnimation } from "engine/types"
import { rgbToRgbw } from "engine/utils"
import { Button, Input } from "@material-tailwind/react"
import convert from "color-convert"
import { v1 as uuidv1 } from "uuid"

type BounceFormProps = {
  onAdd: (opts: BounceAnimation) => void
}

type BounceFormOpts = {
  color: string
  name: string
  id: string
  speed: number
  endLed?: number
  startLed?: number
}

export function AddBounceAnimation(props: BounceFormProps) {
  const { onAdd } = props
  const [opts, setOpts] = useState<BounceFormOpts>({
    color: "",
    id: uuidv1(),
    name: "",
    speed: 100,
    endLed: undefined,
    startLed: undefined,
  })

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    setOpts({
      ...opts,
      name,
    })
  }

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.currentTarget.value
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

    onAdd(bounceOpts)
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Name"
        value={opts.name}
        onChange={handleNameChange}
        crossOrigin={undefined}
      ></Input>
      <Input
        label="Color"
        value={opts.color}
        onChange={handleColorChange}
        crossOrigin={undefined}
      ></Input>
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
        Add New Lamp
      </Button>
    </div>
  )
}
