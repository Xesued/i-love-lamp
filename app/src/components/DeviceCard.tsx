import { Card, CardBody } from "@material-tailwind/react"
import Typography from "@material-tailwind/react/components/Typography"

interface DeviceCardProps {
  device: { guid: string; name: string }
  isSelected: boolean

  /** Called when one of the menu items is selected.  Returns the action selected */
  onSelect: () => void
}

/**
 * Card to display a devices basic information
 *
 *
 */
export const DeviceCard = (props: DeviceCardProps) => {
  const { device, onSelect, isSelected } = props

  return (
    <Card
      style={{ width: "100%" }}
      className={`${isSelected ? "bg-cyan-300" : ""}`}
      onClick={onSelect}
    >
      <CardBody className="p-3">
        <Typography>{device.name}</Typography>
      </CardBody>
    </Card>
  )
}
