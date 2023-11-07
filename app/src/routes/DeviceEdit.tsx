import { Button, Input, Typography } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useGetDeviceQuery, useUpdateDeviceMutation } from "../api/lampApi"

type FormErrors = {
  ip?: string
  name?: string
  numOfLeds?: string
}

export default function EditDevice() {
  const navigate = useNavigate()
  const { deviceGuid } = useParams()

  console.log("DEVICE GUID", deviceGuid)
  const { data: device, isLoading } = useGetDeviceQuery(
    // TODO: how to better type and handle this.
    deviceGuid || "",
  )
  const [updateDevice, updateResult] = useUpdateDeviceMutation()

  const [newName, setNewName] = useState("")
  const [newNumOfLeds, setNewNumOfLeds] = useState("")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (device) {
      setNewName(device.name)
      setNewNumOfLeds(device.numOfLeds + "")
    }
  }, [device])

  const handleNewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNewName(e.currentTarget.value)
  }

  const handleNewNumOfLeds = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (isNaN(parseInt(value))) {
      return
    }
    setNewNumOfLeds(e.currentTarget.value)
  }

  const handleCreateNewLamp = () => {
    const errors: FormErrors = {}
    if (newName === "") {
      errors.name = "Name is required"
    }

    const numOfLeds = parseInt(newNumOfLeds, 10)
    if (isNaN(numOfLeds) || numOfLeds < 1) {
      errors.numOfLeds =
        "Number of leds needs to be a number greater than zero."
    }

    setFormErrors(errors)

    const lampParts = {
      guid: deviceGuid,
      name: newName,
      numOfLeds: parseInt(newNumOfLeds, 10),
    }

    updateDevice(lampParts)
  }

  useEffect(() => {
    if (updateResult.status === "fulfilled" && updateResult.isSuccess) {
      navigate("/devices")
    }
  }, [updateResult])

  if (!device) {
    return <div>Loading....</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2">Add New Lamp</Typography>
      <div className="flex flex-col gap-2">
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            label="Ip Address"
            value={device.currentIP || ""}
            disabled
            crossOrigin={undefined}
          />
          {!!formErrors.ip && (
            <Typography variant="small" color="red">
              {formErrors.ip}
            </Typography>
          )}
        </div>
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            error={!!formErrors.ip}
            label="Mac Address"
            value={device.macAddress}
            disabled
            crossOrigin={undefined}
          />
          {!!formErrors.ip && (
            <Typography variant="small" color="red">
              {formErrors.ip}
            </Typography>
          )}
        </div>
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            error={!!formErrors.name}
            label="Lamp Name"
            value={newName}
            onChange={handleNewNameChange}
            crossOrigin={undefined}
          />
          {!!formErrors.name && (
            <Typography variant="small" color="red">
              {formErrors.name}
            </Typography>
          )}
        </div>
        <div>
          {/* Type bug?  Requireing me to add crossOrigin undefined... */}
          <Input
            error={!!formErrors.name}
            label="Number of LEDs"
            value={newNumOfLeds}
            onChange={handleNewNumOfLeds}
            crossOrigin={undefined}
          />
          {!!formErrors.name && (
            <Typography variant="small" color="red">
              {formErrors.numOfLeds}
            </Typography>
          )}
        </div>
      </div>
      <Button color="blue" onClick={() => handleCreateNewLamp()}>
        Update Device
      </Button>
    </div>
  )
}
