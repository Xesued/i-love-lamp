import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Select, Option, Typography } from "@material-tailwind/react"

import { AnimationCard } from "../components/animations/AnimationCard"
import { IAnimation, useGetAnimationsQuery, useGetDevicesQuery, useToggleAnimationMutation } from "../api/lampApi"


function App() {
  const { data: lamps } = useGetDevicesQuery()
  const { data: animations } = useGetAnimationsQuery()
  const [toggleLampAnimation, toggleResults] = useToggleAnimationMutation()
  const [selectedLampGuid, setSelectedLampGuid] = useState<string | null>(null)

  const handleSelectLamp = (lampGuid: string | undefined) => {
    lampGuid 
      ? setSelectedLampGuid(lampGuid)
      : setSelectedLampGuid(null) 
  }

  const handleToggleAnimation = (animation: IAnimation) => {
    if (!selectedLampGuid || !lamps) return
    const lamp = lamps.find(l => l.guid === selectedLampGuid)
    if (!lamp) return

    toggleLampAnimation({animationGuid: animation.guid, deviceGuid: selectedLampGuid})
  }


  const hasLamps = !!lamps && lamps.length > 0
  const selectedLamp = selectedLampGuid ? lamps?.find(l=> l.guid === selectedLampGuid) : null

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
          <div>
            <Typography variant="h3">Lamp Animations</Typography>
            <div className="flex flex-col gap-3">
              {animations ? 
                animations.map((animation) => (
                  <AnimationCard
                    onClick={() => handleToggleAnimation(animation)}
                    animation={animation}
                    isActive={selectedLamp.animationGuids.includes(animation.guid)}
                  />
                ))
              : <div> NO ANIMATIONS BUDDY</div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
