import mongoose, { Schema } from "mongoose"
import type { InferSchemaType } from "mongoose"

const schema = new Schema({
  guid: { type: String, required: true },
  name: { type: String, required: true },
  current_ip: { type: String, required: true },
  mac_address: { type: String, required: true },
  num_of_leds: { type: Number, required: true },
})

export type Lamp = InferSchemaType<typeof schema>
export const LampModel = mongoose.model("Lamp", schema)
