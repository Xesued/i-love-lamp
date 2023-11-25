import { Breadcrumbs, Typography } from "@material-tailwind/react"
import Tabs, {
  Tab,
  TabPanel,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react/components/Tabs"
import { RGBW } from "engine/types"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  IAnimation,
  useGetAnimationsQuery,
  useGetDeviceQuery,
  useSetSolidColorMutation,
  useToggleAnimationMutation,
} from "../api/lampApi"
import { ColorPicker } from "../components/ColorPicker"
import { LampPreview } from "../components/LampPreview"
import { AnimationCard } from "../components/animations/AnimationCard"
import { useThrottle } from "../hooks/useThrottle"

export const DeviceAnimations = () => {
  const { deviceGuid } = useParams()
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>([])
  const [toggleAnimation] = useToggleAnimationMutation()
  const [setSolidColorMutation] = useSetSolidColorMutation()
  const { data: animations } = useGetAnimationsQuery()
  const { data: device } = useGetDeviceQuery(
    // TODO: how to better type and handle this.
    deviceGuid || "",
  )

  const [solidColor, setSolidColor] = useState<RGBW | null>(null)
  const throttledColor = useThrottle(solidColor, 100)
  useEffect(() => {
    if (throttledColor && device) {
      // TODO: Batch?
      setSolidColorMutation({
        lampGuid: device.guid,
        color: throttledColor,
      })
    }
  }, [throttledColor, device])

  const handleToggleAnimation = (animation: IAnimation) => {
    if (!device) return

    const aIndex = selectedAnimations.indexOf(animation.guid)
    const turnOn = aIndex === -1

    if (turnOn) {
      // Add to the selected animations
      setSelectedAnimations([...selectedAnimations, animation.guid])
    } else {
      setSelectedAnimations([
        ...selectedAnimations.slice(0, aIndex),
        ...selectedAnimations.slice(aIndex + 1),
      ])
    }

    toggleAnimation({
      deviceGuid: device.guid,
      animationGuid: animation.guid,
    })
  }

  const handleColorChange = (newColor: RGBW) => {
    setSolidColor(newColor)
  }

  if (!device) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <a href="#">{device.name}</a>
      </Breadcrumbs>
      <Typography variant="h3">{device.name}</Typography>
      <div className="flex gap-2">
        <div className="w-3/12">
          <LampPreview device={device} />
        </div>
        <Tabs value="animations">
          <TabsHeader>
            <Tab value={"animations"}>Animations</Tab>
            <Tab value={"solid"}>Color</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel className="p-0 pt-4" value="animations">
              <div className="flex flex-col gap-3">
                {animations ? (
                  animations.map((animation) => (
                    <AnimationCard
                      key={animation.guid}
                      onClick={() => handleToggleAnimation(animation)}
                      animation={animation}
                      isActive={selectedAnimations.includes(animation.guid)}
                    />
                  ))
                ) : (
                  <div>NO ANIMATIONS BUDDY</div>
                )}
              </div>
            </TabPanel>
            <TabPanel className="p-0 pt-4" value="solid">
              <div className="flex flex-col items-center">
                <Typography variant="small" color="gray">
                  Setting a color will turn off all other animations
                </Typography>
                <ColorPicker
                  color={device.colors?.[0] || [255, 0, 0, 0]}
                  onChange={handleColorChange}
                />
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  )
}
