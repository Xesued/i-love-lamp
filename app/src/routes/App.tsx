import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  Alert,
  Select,
  Option,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
  CardBody,
} from "@material-tailwind/react"

import { RgbColorPicker, RgbColor } from "react-colorful"

import { AnimationCard } from "../components/animations/AnimationCard"
import {
  IAnimation,
  useBulkSetAnimationsMutation,
  useGetAnimationsQuery,
  useGetDevicesQuery,
  useSetSolidColorMutation,
  useToggleAnimationMutation,
} from "../api/lampApi"

// Adapted from:
// https://github.com/uidotdev/usehooks/blob/main/index.js
export function useThrottle<T>(value: T, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef<number | null>(null)

  useEffect(() => {
    const now = Date.now()

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now
        setThrottledValue(value)
      }, interval)

      return () => window.clearTimeout(id)
    }
  }, [value, interval])

  return throttledValue
}

function App() {
  const { data: lamps } = useGetDevicesQuery()
  const { data: animations } = useGetAnimationsQuery()
  // const [toggleLampAnimation] = useToggleAnimationMutation()
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>([])
  const [bulkSetAnimations] = useBulkSetAnimationsMutation()
  const [setSolidColorMutation] = useSetSolidColorMutation()
  const [selectedLampGuids, setSelectedLampGuids] = useState<string[]>([])
  const [solidColor, setSolidColor] = useState<RgbColor>({
    r: 200,
    g: 150,
    b: 0,
  })

  const throttledColor = useThrottle(solidColor, 500)
  useEffect(() => {
    if (selectedLampGuids.length > 0 && throttledColor) {
      // TODO: Batch?
      selectedLampGuids.forEach((lGuid) => {
        setSolidColorMutation({
          lampGuid: lGuid,
          color: [solidColor.r, solidColor.g, solidColor.b, 0],
        })
      })
    }
  }, [throttledColor, selectedLampGuids])

  const handleSelectLamp = (lampGuid: string | undefined) => {
    if (lampGuid) {
      const lampIndex = selectedLampGuids.findIndex((lg) => lg === lampGuid)
      if (lampIndex > -1) {
        setSelectedLampGuids([
          ...selectedLampGuids.slice(0, lampIndex),
          ...selectedLampGuids.slice(lampIndex + 1),
        ])
      } else {
        setSelectedLampGuids([...selectedLampGuids, lampGuid])
      }
    }
  }

  const handleToggleAnimation = (animation: IAnimation) => {
    if (!lamps) return

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

    bulkSetAnimations({
      deviceGuids: selectedLampGuids,
      animationGuid: animation.guid,
      isOn: turnOn,
    })
  }

  const handleColorChange = (newColor: RgbColor) => {
    setSolidColor(newColor)
  }

  const hasLamps = !!lamps && lamps.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {hasLamps ? (
          <div className="flex flex-row gap-2 justify-center">
            {lamps.map((lamp) => (
              <Card
                onClick={() => handleSelectLamp(lamp.guid)}
                variant="filled"
                color={selectedLampGuids.includes(lamp.guid) ? "blue" : "white"}
              >
                <CardBody>{lamp.name}</CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Alert color="red">
            No lamps. <Link to="add-lamp">Add one.</Link>
          </Alert>
        )}

        {selectedLampGuids.length > 0 && (
          <Tabs value="animation">
            <TabsHeader>
              <Tab value={"animations"}>Animations</Tab>
              <Tab value={"solid"}>Color</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="animations">
                <div className="flex flex-col gap-3">
                  {animations ? (
                    animations.map((animation) => (
                      <AnimationCard
                        onClick={() => handleToggleAnimation(animation)}
                        animation={animation}
                        isActive={selectedAnimations.includes(animation.guid)}
                      />
                    ))
                  ) : (
                    <div> NO ANIMATIONS BUDDY</div>
                  )}
                </div>
              </TabPanel>
              <TabPanel value="solid">
                <Typography variant="small" color="gray">
                  Setting a color will turn off all other animations
                </Typography>
                <RgbColorPicker
                  // color={solidColor}
                  onChange={handleColorChange}
                />
              </TabPanel>
            </TabsBody>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default App
