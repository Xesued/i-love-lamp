import { useState } from "react"
import { Button, Input } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import { addLamp } from "../state/lampSlice"
import { useAppDispatch } from "../state/hooks"

export default function AddLamp() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [newIp, setNewIp] = useState("")
  const [newName, setNewName] = useState("")

  const handleNewIpChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNewIp(e.currentTarget.value)
  }

  const handleNewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNewName(e.currentTarget.value)
  }

  const handleCreateNewLamp = () => {
    const lamp = {
      name: newName,
    }
    dispatch(addLamp({ id: parseInt(newIp, 10), lamp }))
    navigate("/lamps")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1>Add New Lamp</h1>
      <div className="flex flex-col gap-2">
        <div>Ip:</div>
        <div>
          <Input value={newIp} onChange={handleNewIpChange} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>Name:</div>
        <div>
          <Input value={newName} onChange={handleNewNameChange} />
        </div>
      </div>
      <Button
        variant="ghost"
        color="success"
        onClick={() => handleCreateNewLamp()}
      >
        Add New Lamp
      </Button>
    </div>
  )
}
