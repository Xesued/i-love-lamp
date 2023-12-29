import {
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"
import {
  useGetAnimationsQuery,
  useRemoveAnimationMutation,
} from "../api/lampApi"

export default function Config() {
  const navigate = useNavigate()
  const [removeAnimation] = useRemoveAnimationMutation()
  const { data: animations } = useGetAnimationsQuery()

  const handleAddNew = () => {
    navigate("/animations/new")
  }

  const handleEdit = (id: string) => {
    navigate(`/animations/edit/${id}`)
  }

  const handleDelete = (animationGuid: string) => {
    removeAnimation(animationGuid)
  }

  if (!animations) {
    return <div> Loading....</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Animations</Typography>
      <List>
        {animations.map((animation) => (
          <ListItem key={animation.name} className="py-1 pr-1 pl-4">
            <div className="flex flex-col">
              <Typography variant="small">
                Type: {animation.details.type}
              </Typography>
              <Typography>{animation.name} </Typography>
            </div>
            <ListItemSuffix className="flex gap-2 ">
              <Button
                size="sm"
                color="blue"
                onClick={() => handleEdit(animation.guid)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="red"
                onClick={() => handleDelete(animation.guid)}
              >
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
