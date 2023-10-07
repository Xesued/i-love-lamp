import { AnimationItem, AnimationType } from "engine/types"
import { BlinkCard } from "./BlinkCard"

type AnimationCardProps = {
  animation: AnimationItem
  isActive: boolean
  onClick: () => void
}

export function AnimationCard(props: AnimationCardProps) {
  const { animation } = props

  switch (animation.type) {
    case AnimationType.BLINK: {
      return <BlinkCard {...props} />
    }
    default:
      return <div>Unknown animation: {animation.type}</div>
  }
}
