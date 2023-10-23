import { useState } from "react"
import { Select, Option, Typography } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"
import { AnimationType } from "engine/types"
import { IAnimationNew, useAddAnimationMutation } from "../api/lampApi"

import { EditBounceAnimation } from "../components/animations/EditBounceAnimation"
import { EditSolidAnimation } from "../components/animations/EditSolidAnimation"
import { EditBlinkAnimation } from "../components/animations/EditBlinkAnimation"

export default function AddAnimation() {
  const navigate = useNavigate()
  const [addAnimation] = useAddAnimationMutation()
  const [type, setType] = useState<AnimationType | null>(null)

  const handleSelectAnimationType = (value: string | undefined) => {
    if (!value) return

    switch (value) {
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

  const handleAddAnimation = async (opts: IAnimationNew) => {
    await addAnimation(opts)
    navigate("/animations")
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2">Add New Animation</Typography>
      <div className="flex flex-col gap-2">
        <div>
          <Select onChange={handleSelectAnimationType}>
            <Option value={AnimationType.BLINK}>{AnimationType.BLINK}</Option>
            <Option value={AnimationType.BOUNCE}>{AnimationType.BOUNCE}</Option>
            <Option value={AnimationType.SOLID}>{AnimationType.SOLID}</Option>
          </Select>
        </div>
        <div>
          {type === AnimationType.BLINK && (
            <EditBlinkAnimation onSubmit={handleAddAnimation} />
          )}
          {type === AnimationType.BOUNCE && (
            <EditBounceAnimation onSubmit={handleAddAnimation} />
          )}
          {type === AnimationType.SOLID && (
            <EditSolidAnimation onSubmit={handleAddAnimation} />
          )}
        </div>
      </div>
    </div>
  )
}
