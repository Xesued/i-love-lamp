import { BlinkAnimation } from "../../state/animationSlice"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react"
import { ledToRGB } from "../../utils/colorUtils"

type BlinkCardProps = {
  animation: BlinkAnimation
  isActive: boolean
  onClick: () => void
}

export function BlinkCard(props: BlinkCardProps) {
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
              <Typography variant="small">Type: Blink</Typography>
              <Typography variant="h5">{animation.name}</Typography>
            </div>
            <Typography className="text-xs">{ledsStr}</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <Typography className="text-xs">On</Typography>
              <div
                className="h-8 w-8 border-2"
                style={{ backgroundColor: ledToRGB(animation.onColor) }}
              ></div>
              <Typography className="text-xs">
                {animation.onDuration} ms
              </Typography>
            </div>
            <div>
              <Typography className="text-xs">
                {animation.transition}ms
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              <Typography className="text-xs">Off</Typography>
              <div
                className="h-8 w-8 border-2"
                style={{ backgroundColor: ledToRGB(animation.offColor) }}
              ></div>
              <Typography className="text-xs">
                {animation.offDuration} ms
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
