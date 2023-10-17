import { Schema, model } from "mongoose"

export interface ILamp {
  guid: string
  name: string
  current_ip: string
  mac_address: string
  num_of_leds: number
}

const schema = new Schema<ILamp>({
  guid: { type: String, required: true },
  name: { type: String, required: true },
  current_ip: { type: String, required: true },
  mac_address: { type: String, required: true },
  num_of_leds: { type: Number, required: true },
})

export const LampModel = model<ILamp>("Lamp", schema)
