import type { Meta, StoryObj } from "@storybook/react"

import { Lamp } from "./Lamp"

const meta = {
  title: "Lamp/Example",
  component: Lamp,
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
} satisfies Meta<typeof Lamp>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    colors: [
      [255, 0, 0, 0],
      [155, 155, 0, 0],
      [55, 55, 55, 0],
      [255, 0, 0, 0],
      [0, 0, 255, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
      [0, 0, 255, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
      [0, 0, 255, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
      [0, 0, 255, 0],
      [0, 0, 255, 0],
      [0, 0, 255, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
      [255, 0, 0, 0],
    ],
  },
}
