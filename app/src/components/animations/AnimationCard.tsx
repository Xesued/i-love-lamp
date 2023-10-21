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
      return <BlinkCard name={animation.name} animation={animation.details} {...rest} />
    }
    case AnimationType.SOLID: {
      return <SolidCard name={animation.name} animation={animation.details} {...rest} />
    }
    case AnimationType.BOUNCE: {
      return <BounceCard name={animation.name} animation={animation.details} {...rest} />
    }
  }
}
