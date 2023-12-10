import { Typography } from "@material-tailwind/react"

type SectionHeaderProps = {
  header: string
}

export default function SectionHeader(props: SectionHeaderProps) {
  let { header } = props
  return <Typography className="text-lg">{header}</Typography>
}
