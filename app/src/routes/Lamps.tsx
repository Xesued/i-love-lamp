import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import type { Lamp } from "../api/lampApi"
import { useAddDeviceMutation, useGetDevicesQuery, useRemoveDeviceMutation } from "../api/lampApi"

export default function LampList() {
  const navigate = useNavigate()

  const { 
    data: lamps,
  } = useGetDevicesQuery()
  const [addDevice, addResult] = useAddDeviceMutation()
  const [removeDevice, removeResult] = useRemoveDeviceMutation()

  const handleDeleteLamp = (lampGuid: string) => {
    removeDevice(lampGuid)
  }

  const handleCreateNewLamp = (lampParts: Omit<Lamp, 'guid'>) => {
    addDevice(lampParts)
    navigate("/add-lamp")
  }

  if (!lamps) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Lamps</Typography>
      <List>
        {lamps.map(lamp => (
          <ListItem key={lamp.guid} className="py-1 pr-1 pl-4">
            {lamp.current_ip}: {lamp.name}{" "}
            <ListItemSuffix>
              <Button
                color="amber"
                onClick={() => handleDeleteLamp(lamp.guid)}
              >
                {" "}
                Delete
              </Button>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>

      <Button color="blue" onClick={handleCreateNewLamp}>
        Add New Lamp
      </Button>
    </div>
  )
}
