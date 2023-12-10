import { Typography } from "@material-tailwind/react"

type RouteHeaderProps = {
  header: string
}

export default function RouteHeader(props: RouteHeaderProps) {
  let { header } = props
  return <Typography className="text-xl">{header}</Typography>
}
