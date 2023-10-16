import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Select, Option, Typography } from "@material-tailwind/react"
import type { AnimationItem } from "engine/types"

import { AnimationCard } from "../components/animations/AnimationCard"
import { useAppSelector, useAppDispatch } from "../state/hooks"
import { toggleLampAnimation } from "../state/lampSlice"
import { useGetDevicesQuery } from "../api/lampApi"

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const { data: lamps } = useGetDevicesQuery()
  const animations = useAppSelector((state) => state.animations.value)
  const [selectedLampGuid, setSelectedLampGuid] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  console.log("Selected lamp", selectedLampGuid)
  const handleSelectLamp = (lampGuid: string | undefined) => {
    lampGuid 
      ? setSelectedLampGuid(lampGuid)
      : setSelectedLampGuid(null) 
  }

  const handleToggleAnimation = (animation: AnimationItem) => {
    // if (!selectedLampIp || !lamps) return

    // const lamp = lamps[selectedLampIp]
    // if (!lamp) return

    // TODO: API is a fire-n-forget.  Next steps is to have it own
    // the data for what animations are running on what devices.
    // At that point, we will move to a more robust RTK Query
    // api.  For now, just fire off a POST via fetch

    // if (!lamp.animations.includes(animation.name)) {
    //   // We don't have that animation, it's going to be turned on..
    //   // send an add animation to server
    //   fetch(`${API_URL}/animations/${selectedLampIp}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(animation),
    //   })
    // } else {
    //   fetch(`${API_URL}/animations/${selectedLampIp}/${animation.id}`, {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(animation),
    //   })
    // }

    // dispatch(
    //   toggleLampAnimation({
    //     ip: selectedLampIp,
    //     animationName: animation.name,
    //   }),
    // )
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
              {animations.map((animation) => (
                <AnimationCard
                  onClick={() => handleToggleAnimation(animation)}
                  animation={animation}
                  isActive
                  // isActive={selectedLamp.animations.includes(animation.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
