import { AnimationType } from "engine/types"
import { BlinkCard } from "./BlinkCard"
import { SolidCard } from "./SolidCard"
import { BounceCard } from "./Bounce"
import { IAnimation } from "../../api/lampApi"

type AnimationCardProps = {
  animation: IAnimation
  isActive: boolean
  onClick: () => void
}

export function AnimationCard(props: AnimationCardProps) {
  const { animation, ...rest } = props

  switch (animation.details.animationType) {
    case AnimationType.BLINK: {
      return <BlinkCard animation={animation.details} {...rest} />
    }
    case AnimationType.SOLID: {
      return <SolidCard animation={animation.details} {...rest} />
    }
    case AnimationType.BOUNCE: {
      return <BounceCard animation={animation.details} {...rest} />
    }
  }
}
