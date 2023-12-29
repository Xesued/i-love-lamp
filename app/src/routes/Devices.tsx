import {
  Button,
  List,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import {
  useGetDevicesQuery,
  useRemoveDeviceMutation,
  useScanForDevicesMutation,
} from "../api/lampApi"
import RouteHeader from "../components/RouteHeader"

export default function DeviceList() {
  const navigate = useNavigate()

  const { data: devices } = useGetDevicesQuery()
  const [removeDevice] = useRemoveDeviceMutation()
  const [scanDevices, { isLoading: isScanning }] = useScanForDevicesMutation()

  const handleDeleteLamp = (lampGuid: string) => {
    removeDevice(lampGuid)
  }

  const handleEditLamp = (guid: string) => {
    navigate(`/devices/${guid}/edit`)
  }

  const handleAddByHand = () => {
    navigate(`/devices/new`)
  }

  const handleScan = () => {
    scanDevices()
  }

  if (!devices || isScanning) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <RouteHeader header="Devices" />
      <List>
        {devices.map((lamp) => (
          <ListItem key={lamp.guid} className="py-1 pr-1 pl-4">
            {lamp.currentIP}: {lamp.name}{" "}
            <ListItemSuffix>
              <Button color="amber" onClick={() => handleEditLamp(lamp.guid)}>
                Edit
              </Button>
              <Button color="amber" onClick={() => handleDeleteLamp(lamp.guid)}>
                Delete
              </Button>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>

      <Button color="blue" onClick={handleScan} placeholder={undefined}>
        Scan For New Devices
      </Button>
      <Button onClick={handleAddByHand}>Add By Hand</Button>
    </div>
  )
}
