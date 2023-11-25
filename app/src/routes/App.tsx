import { Alert, Typography } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"

import { useGetDevicesQuery } from "../api/lampApi"
import { DeviceCard } from "../components/DeviceCard"

function App() {
  const navigate = useNavigate()
  const { data: devices } = useGetDevicesQuery()

  const handleSelectDevice = (deviceGuid: string | undefined) => {
    navigate(`/devices/${deviceGuid}/animations`)
  }

  const hasDevices = !!devices && devices.length > 0

  return (
    <div className="flex flex-col gap-6">
      {hasDevices ? (
        <div className="flex flex-col gap-4">
          <Typography variant="h3">Devices</Typography>
          {devices.map((device) => (
            <DeviceCard
              device={device}
              onSelect={() => handleSelectDevice(device.guid)}
            />
          ))}
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
