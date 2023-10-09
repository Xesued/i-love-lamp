import { ReactEventHandler, useState } from "react"
import {
  Button,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"
import { Animation, AnimationItem, AnimationType } from "engine/types"

import { addAnimation } from "../state/animationSlice"
import { useAppDispatch } from "../state/hooks"
import { AddBounceAnimation } from "../components/animations/AddBounceAnimation"

export default function AddAnimation() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [type, setType] = useState<AnimationType | null>(null)

  const handleSelectAnimationType = (value: string | undefined) => {
    if (!value) return
    const v = parseInt(value)
    if (isNaN(v)) return

    switch (v) {
      case AnimationType.BLINK:
        setType(AnimationType.BLINK)
        break
      case AnimationType.BOUNCE:
        setType(AnimationType.BOUNCE)
        break
      case AnimationType.SOLID:
        setType(AnimationType.SOLID)
        break
      default:
        setType(null)
    }
  }

  const handleAddAnimation = (opts: AnimationItem) => {
    dispatch(addAnimation(opts))
    navigate("/animations")
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2">Add New Animation</Typography>
      <div className="flex flex-col gap-2">
        <div>
          <Select onChange={handleSelectAnimationType}>
            <Option value={"" + AnimationType.BLINK}>
              {AnimationType[AnimationType.BLINK]}
            </Option>
            <Option value={"" + AnimationType.BOUNCE}>
              {AnimationType[AnimationType.BOUNCE]}
            </Option>
            <Option value={"" + AnimationType.SOLID}>
              {AnimationType[AnimationType.SOLID]}
            </Option>
          </Select>
        </div>
        <div>
          {type === AnimationType.BLINK && <div>Show ??blink form</div>}
          {type === AnimationType.BOUNCE && (
            <AddBounceAnimation onAdd={handleAddAnimation} />
          )}
          {type === AnimationType.SOLID && <div>Show solid form</div>}
        </div>
      </div>
    </div>
  )
}
