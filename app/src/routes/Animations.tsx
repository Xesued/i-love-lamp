import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "../state/hooks"

export default function Config() {
  const navigate = useNavigate()
  const animations = useAppSelector((state) => state.animations.value)
  const dispatch = useAppDispatch()

  const handleAddNew = () => {
    navigate("/animations/new")
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Animations</Typography>
      <List>
        {animations.map((animation) => (
          <ListItem key={animation.name} className="py-1 pr-1 pl-4">
            {animation.name}{" "}
            <ListItemSuffix className="flex gap-2 ">
              <Button size="sm" color="blue">
                Edit
              </Button>
              <Button size="sm" color="red">
                Delete
              </Button>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleAddNew}>Add New Animation</Button>
    </div>
  )
}
