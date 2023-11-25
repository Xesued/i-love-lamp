import { useEffect, useState } from "react"
import { IDevice } from "../api/lampApi"
import { Lamp } from "./Lamp"

type LampPreviewProps = {
  device: IDevice
}

const BASE_URL = import.meta.env.VITE_WS_URL

function useColorListener(device: IDevice) {
  const [colors, setColors] = useState([])

  useEffect(() => {
    let webSocket = new WebSocket(BASE_URL)

    webSocket.onopen = (e) => {
      console.log("OPEND", e)
    }

    webSocket.onerror = (e) => {
      console.log("Error, booo", e)
    }

    webSocket.onmessage = (e) => {
      let message = JSON.parse(e.data)
      if (message.ip === device.currentIP) {
        setColors(message.leds)
      }
    }

    return () => {
      webSocket.close()
    }
  }, [])

  return colors
}

export const LampPreview = ({ device }: LampPreviewProps) => {
  // Setup a websocket to listento and update the colors of the lamp
  const colors = useColorListener(device)
  return <Lamp colors={colors} />
}
