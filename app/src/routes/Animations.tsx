import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "../state/hooks"
import { removeAnimation } from "../state/animationSlice"
import type { Animation } from "../state/animationSlice"

export default function Config() {
  const navigate = useNavigate()
  const animations = useAppSelector((state) => state.animations.value)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Animations</Typography>
      <List>
        {animations.map((animation) => (
          <ListItem key={animation.name} className="py-1 pr-1 pl-4">
            {animation.name}{" "}
          </ListItem>
        ))}
      </List>

    </div>
  )
}
