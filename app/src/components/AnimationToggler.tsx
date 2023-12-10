import { useEffect, useState } from "react"
import { IAnimation, useBulkSetAnimationsMutation } from "../api/lampApi"
import { arrayRemove } from "../utils/arrayUtils"
import { AnimationCard } from "./animations/AnimationCard"

type AnimationTogglerProps = {
  animations?: IAnimation[]
  selectedDevices: string[]
}

export function AnimationToggler({
  animations,
  selectedDevices,
}: AnimationTogglerProps) {
  const [bulkSetAnimations] = useBulkSetAnimationsMutation()
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>([])

  useEffect(() => {
    bulkSetAnimations({
      deviceGuids: selectedDevices,
      animationGuids: selectedAnimations,
    })
  }, [selectedAnimations, selectedDevices])

  const handleToggleAnimation = (deviceGuid: string) => {
    if (!deviceGuid) return
    let isSelected = selectedAnimations.includes(deviceGuid)
    if (isSelected) {
      setSelectedAnimations(arrayRemove(selectedAnimations, deviceGuid))
    } else {
      setSelectedAnimations([...selectedAnimations, deviceGuid])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {animations ? (
        animations.map((animation) => (
          <AnimationCard
            key={animation.guid}
            onClick={() => handleToggleAnimation(animation.guid)}
            animation={animation}
            isActive={selectedAnimations.includes(animation.guid)}
          />
        ))
      ) : (
        <div>NO ANIMATIONS BUDDY</div>
      )}
    </div>
  )
}
