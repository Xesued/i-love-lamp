import type { Meta, StoryObj } from "@storybook/react"

import { DeviceCard } from "./DeviceCard"

const meta = {
  title: "Device/Card",
  component: DeviceCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "90vw" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DeviceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Selected: Story = {
  args: {
    device: { guid: "123-214", name: "Floor Lamp" },
    onSelect: () => {},
  },
}

export const NotSelected: Story = {
  args: {
    device: { guid: "123-214", name: "Floor Lamp" },
    onSelect: () => {},
  },
}
