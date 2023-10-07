import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { io } from "socket.io-client"
import { Button, Alert } from "@material-tailwind/react"

import { useAppSelector, useAppDispatch } from "../state/hooks"
import { toggleLamp } from "../state/lampSlice"
import { Link } from "react-router-dom"

function App() {
  const socket = io("http://192.168.12.209:3000")
  const lamps = useAppSelector((state) => state.lamps.value)
  const dispatch = useAppDispatch()
  const [color, setColor] = useState("aabbcc")
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    if (!isConnected) return
    console.log("Sending color", color)
    socket.emit("color-change", color)
  }, [isConnected, color])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  const handleSelectLamp = (ip: number) => {
    dispatch(toggleLamp(ip))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2>Selected Lamps</h2>
        <ul className="flex flex-row align-middle gap-4">
          {Object.keys(lamps).length === 0 && (
            <Alert color="red">
                No lamps. <Link to="add-lamp">Add one.</Link>
            </Alert>
          )}
          {Object.entries(lamps).map(([ip, lamp]) => (
            <li>
              <Button
                variant={lamp.isActive ? "filled" : "outlined"}
                onClick={() => handleSelectLamp(parseInt(ip))}
              >
                {lamp.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 color-picker">
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  )
}

export default App
