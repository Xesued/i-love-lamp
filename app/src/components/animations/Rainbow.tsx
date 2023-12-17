import { Card, CardBody, Typography } from "@material-tailwind/react"
import { RainbowAnimation } from "engine/types"

type RainbowCardProps = {
  name: string
  animation: RainbowAnimation
  isActive: boolean
  onClick: () => void
}

export function RainbowCard(props: RainbowCardProps) {
  const { name, animation, isActive, onClick } = props

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
              <Typography variant="small">Type: Rainbow</Typography>
              <Typography variant="h5">{name}</Typography>
            </div>
            <Typography className="text-xs">{ledsStr}</Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
