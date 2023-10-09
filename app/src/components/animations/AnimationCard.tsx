import { AnimationItem, AnimationType } from "engine/types"
import { BlinkCard } from "./BlinkCard"
import { SolidCard } from "./SolidCard"
import { BounceCard } from "./Bounce"

type AnimationCardProps = {
  animation: AnimationItem
  isActive: boolean
  onClick: () => void
}

export function AnimationCard(props: AnimationCardProps) {
  const { animation, ...rest } = props

  switch (animation.type) {
    case AnimationType.BLINK: {
      return <BlinkCard animation={animation} {...rest} />
    }
    case AnimationType.SOLID: {
      return <SolidCard animation={animation} {...rest} />
    }
    case AnimationType.BOUNCE: {
      return <BounceCard animation={animation} {...rest} />
    }
  }
}
