import { useState } from "react"
import { Button, Input, Typography } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

import { addLamp } from "../state/lampSlice"
import { useAppDispatch } from "../state/hooks"

type FormErrors = {
  ip?: string
  name?: string
}

export default function AddLamp() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [newIp, setNewIp] = useState<string | null>("")
  const [newName, setNewName] = useState("")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleNewIpChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNewIp(e.currentTarget.value)
  }

  const handleNewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNewName(e.currentTarget.value)
  }

  const handleCreateNewLamp = () => {
    const errors: FormErrors = {}
    if (newIp === null) {
      errors.ip = "Ip address required"
    } else {
      const ip = parseInt(newIp, 10);
      if (isNaN(ip) || ip > 255 || ip < 0) {
        errors.ip = "Ip address must be a number between 0 and 255"
      }
    }

    if (newName === '') {
      errors.name = "Name is required"
    }
    setFormErrors(errors)

    if (newIp === null || errors.ip || errors.name){
      return;
    }
   

    const lamp = {
      name: newName,
    }

    dispatch(addLamp({ id: parseInt(newIp, 11), lamp }))
    navigate("/lamps")
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2">Add New Lamp</Typography>
      <div className="flex flex-col gap-2">
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            error={!!formErrors.ip}
            label="Last Octlet in IP:"
            value={newIp || ''}
            onChange={handleNewIpChange}
            crossOrigin={undefined}
          />
          {!!formErrors.ip && (
            <Typography variant="small" color="red">{formErrors.ip}</Typography>
          )}
        </div>
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            error={!!formErrors.name}
            label="Lamp Name:"
            value={newName}
            onChange={handleNewNameChange}
            crossOrigin={undefined}
          />
          {!!formErrors.name && (
            <Typography variant="small" color="red">{formErrors.name}</Typography>
          )}
        </div>
      </div>
      <Button color="blue" onClick={() => handleCreateNewLamp()}>
        Add New Lamp
      </Button>
    </div>
  )
}
