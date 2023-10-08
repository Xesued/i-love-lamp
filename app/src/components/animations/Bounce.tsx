import { BounceAnimation } from "engine/types"
import { Card, CardBody, Typography } from "@material-tailwind/react"
import { ledToRGB } from "../../utils/colorUtils"

type BounceCardProps = {
  animation: BounceAnimation
  isActive: boolean
  onClick: () => void
}

export function BounceCard(props: BounceCardProps) {
  const { animation, isActive, onClick } = props

  let ledsStr = `Leds: ${
    !animation.startLed ? "Beginning" : animation.startLed
  } to ${!animation.endLed ? "End" : animation.endLed}`
  if (!animation.startLed && !animation.endLed) {
    ledsStr = "All LEDs"
  }

  return (
    <Card
      variant="filled"
      color={isActive ? "blue" : "white"}
      onClick={onClick}
    >
      <CardBody className="p-4">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex flex-col">
              <Typography variant="small">Type: Bounce</Typography>
              <Typography variant="h5">{animation.name}</Typography>
            </div>
            <Typography className="text-xs">{ledsStr}</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className="h-8 w-8 border-2"
                style={{ backgroundColor: ledToRGB(animation.color) }}
              ></div>
              <Typography className="text-xs">{animation.speed}ms</Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
