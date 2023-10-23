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
} from "@material-tailwind/react"

import { RgbColorPicker, RgbColor } from "react-colorful"

import { AnimationCard } from "../components/animations/AnimationCard"
import {
  IAnimation,
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
  const [toggleLampAnimation] = useToggleAnimationMutation()
  const [setSolidColorMutation] = useSetSolidColorMutation()
  const [selectedLampGuid, setSelectedLampGuid] = useState<string | null>(null)
  const [solidColor, setSolidColor] = useState<RgbColor>({
    r: 200,
    g: 150,
    b: 0,
  })

  const throttledColor = useThrottle(solidColor, 500)
  useEffect(() => {
    if (selectedLampGuid && throttledColor) {
      setSolidColorMutation({
        lampGuid: selectedLampGuid,
        color: [solidColor.r, solidColor.g, solidColor.b, 0],
      })
    }
  }, [throttledColor, selectedLampGuid])

  const handleSelectLamp = (lampGuid: string | undefined) => {
    lampGuid ? setSelectedLampGuid(lampGuid) : setSelectedLampGuid(null)
  }

  const handleToggleAnimation = (animation: IAnimation) => {
    if (!selectedLampGuid || !lamps) return
    const lamp = lamps.find((l) => l.guid === selectedLampGuid)
    if (!lamp) return

    toggleLampAnimation({
      animationGuid: animation.guid,
      deviceGuid: selectedLampGuid,
    })
  }

  const handleColorChange = (newColor: RgbColor) => {
    setSolidColor(newColor)
  }

  const hasLamps = !!lamps && lamps.length > 0
  const selectedLamp = selectedLampGuid
    ? lamps?.find((l) => l.guid === selectedLampGuid)
    : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {hasLamps ? (
          <Select label="Selected Lamp" onChange={handleSelectLamp}>
            {lamps.map((lamp) => (
              <Option value={lamp.guid}>{lamp.name}</Option>
            ))}
          </Select>
        ) : (
          <Alert color="red">
            No lamps. <Link to="add-lamp">Add one.</Link>
          </Alert>
        )}

        {selectedLamp && (
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
                        isActive={selectedLamp.animationGuids.includes(
                          animation.guid,
                        )}
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
                  value={solidColor}
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
