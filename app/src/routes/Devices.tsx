import {
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import {
  useGetDevicesQuery,
  useRemoveDeviceMutation,
  useScanForDevicesMutation,
} from "../api/lampApi"

export default function LampList() {
  const navigate = useNavigate()

  const { data: lamps } = useGetDevicesQuery()
  const [removeDevice] = useRemoveDeviceMutation()
  const [scanDevices, { isLoading: isScanning }] = useScanForDevicesMutation()

  const handleDeleteLamp = (lampGuid: string) => {
    removeDevice(lampGuid)
  }

  const handleEditLamp = (guid: string) => {
    navigate(`/devices/edit/${guid}`)
  }

  const handleScan = () => {
    scanDevices()
  }

  if (!lamps || isScanning) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Lamps</Typography>
      <List>
        {lamps.map((lamp) => (
          <ListItem key={lamp.guid} className="py-1 pr-1 pl-4">
            {lamp.currentIP}: {lamp.name}{" "}
            <ListItemSuffix>
              <Button color="amber" onClick={() => handleEditLamp(lamp.guid)}>
                {" "}
                Edit
              </Button>
              <Button color="amber" onClick={() => handleDeleteLamp(lamp.guid)}>
                {" "}
                Delete
              </Button>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>

      <Button color="blue" onClick={handleScan}>
        Scan For New Devices
      </Button>
    </div>
  )
}
