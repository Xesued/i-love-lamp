import { Alert, Typography } from "@material-tailwind/react"
import { useState } from "react"
import { Link } from "react-router-dom"

import Tabs, {
  Tab,
  TabPanel,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react/components/Tabs"
import { useGetAnimationsQuery, useGetDevicesQuery } from "../api/lampApi"
import { AnimationToggler } from "../components/AnimationToggler"
import { ColorPicker } from "../components/ColorPicker"
import { DeviceCard } from "../components/DeviceCard"
import SectionHeader from "../components/SectionHeader"
import { arrayRemove } from "../utils/arrayUtils"

function App() {
  const { data: devices } = useGetDevicesQuery()
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const { data: animations } = useGetAnimationsQuery()

  const handleSelectDevice = (deviceGuid: string | undefined) => {
    if (!deviceGuid) return
    let isSelected = selectedDevices.includes(deviceGuid)
    if (isSelected) {
      setSelectedDevices(arrayRemove(selectedDevices, deviceGuid))
    } else {
      setSelectedDevices([...selectedDevices, deviceGuid])
    }
  }

  const handleColorChange = () => {}

  const hasDevices = !!devices && devices.length > 0

  return (
    <div className="flex flex-col gap-6">
      {hasDevices ? (
        <div className="flex flex-col gap-4">
          <SectionHeader header="Select Devices" />
          <div className="flex gap-2">
            {devices.map((device) => (
              <DeviceCard
                key={device.guid}
                device={device}
                isSelected={selectedDevices?.includes(device.guid)}
                onSelect={() => handleSelectDevice(device.guid)}
              />
            ))}
          </div>
          <SectionHeader header="Colors" />
          <Tabs value="animations">
            <TabsHeader>
              <Tab value={"animations"}>Animations</Tab>
              <Tab value={"solid"}>Color</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel className="p-0 pt-4" value="animations">
                <AnimationToggler
                  selectedDevices={selectedDevices}
                  animations={animations}
                />
              </TabPanel>
              <TabPanel className="p-0 pt-4" value="solid">
                <div className="flex flex-col items-center">
                  <Typography variant="small" color="gray">
                    Setting a color will turn off all other animations
                  </Typography>
                  <ColorPicker
                    color={[255, 0, 0, 0]}
                    onChange={handleColorChange}
                  />
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      ) : (
        <Alert color="red">
          No lamps. <Link to="add-lamp">Add one.</Link>
        </Alert>
      )}
    </div>
  )
}

export default App
