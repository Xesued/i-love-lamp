import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon"

import { Card, CardBody } from "@material-tailwind/react"
import Typography from "@material-tailwind/react/components/Typography"

type ActionTypes = "showDetails" | "delete"

interface DeviceCardProps {
  device: { guid: string; name: string }

  /** Called when one of the menu items is selected.  Returns the action selected */
  onSelect: () => void
}

/**
 * Card to display a devices basic information
 *
 *
 */
export const DeviceCard = (props: DeviceCardProps) => {
  const { device, onSelect } = props

  return (
    <Card style={{ width: "100%" }} onClick={onSelect}>
      <CardBody className="p-3">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-0 items-center">
              <LightBulbIcon className="align-top" width={24} />
              <Typography variant="small">60</Typography>
            </div>
            <div>
              <Typography variant="h5">{device.name}</Typography>
              <Typography variant="small">Lamp in the TV room</Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
