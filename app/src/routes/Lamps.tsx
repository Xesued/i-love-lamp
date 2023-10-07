import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemSuffix,
  IconButton,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "../state/hooks"
import { removeLamp } from "../state/lampSlice"
import type { Lamp } from "../state/lampSlice"
import { TrashIcon } from "@heroicons/react/24/outline"

export default function Config() {
  const navigate = useNavigate()
  const lamps = useAppSelector((state) => state.lamps.value)
  const dispatch = useAppDispatch()

  const handleDeleteLamp = (ip: number) => {
    dispatch(removeLamp(ip))
  }

  const handleCreateNewLamp = () => {
    navigate("/add-lamp")
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Lamps</Typography>
      <List>
        {Object.entries<Lamp>(lamps).map(([ip, lamp]) => (
          <ListItem key={ip} className="py-1 pr-1 pl-4">
            {ip}: {lamp.name}{" "}
            <ListItemSuffix>
              <Button color="amber" onClick={() => handleDeleteLamp(parseInt(ip, 10))}>
                {" "}
                Delete
              </Button>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>

      <Button color="blue" onClick={handleCreateNewLamp}>Add New Lamp</Button>
    </div>
  )
}
