import { useState } from "react"
import { Link } from "react-router-dom"
// import { HexColorPicker } from "react-colorful"
// import { io } from "socket.io-client"
import { Alert, Select, Option, Typography } from "@material-tailwind/react"

import { AnimationCard } from "../components/animations/AnimationCard"
import { useAppSelector, useAppDispatch } from "../state/hooks"
import { toggleLampAnimation } from "../state/lampSlice"
import type { AnimationItem } from "../state/animationSlice"

function App() {
  const lamps = useAppSelector((state) => state.lamps.value)
  const animations = useAppSelector((state) => state.animations.value)
  const [selectedLampIp, setSelectedLampIp] = useState<number | null>(null)
  const dispatch = useAppDispatch()

  const handleSelectLamp = (ipStr: string | undefined) => {
    const ip = parseInt(ipStr || "", 10)
    if (isNaN(ip)) {
      console.warn(`Could not update ip: ${ipStr}`)
    }
    setSelectedLampIp(ip)
  }

  const handleToggleAnimation = (animation: AnimationItem) => {
    if (!selectedLampIp) {
      return
    }

    dispatch(
      toggleLampAnimation({
        ip: selectedLampIp,
        animationName: animation.name,
      }),
    )
  }

  const hasLamps = Object.keys(lamps).length > 0
  const selectedLamp = selectedLampIp ? lamps[selectedLampIp] : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {hasLamps ? (
          <Select label="Selected Lamp" onChange={handleSelectLamp}>
            {Object.entries(lamps).map(([ip, lamp]) => (
              <Option value={ip}>{lamp.name}</Option>
            ))}
          </Select>
        ) : (
          <Alert color="red">
            No lamps. <Link to="add-lamp">Add one.</Link>
          </Alert>
        )}

        {selectedLamp && (
          <div>
            <Typography variant="h3">Lamp Animations</Typography>
            {animations.map((animation) => (
              <AnimationCard
                onClick={() => handleToggleAnimation(animation)}
                animation={animation}
                isActive={selectedLamp.animations.includes(animation.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
