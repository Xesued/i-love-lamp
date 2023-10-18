import { AnimationItem } from "engine/types"
import { Schema, model } from "mongoose"

/**
 * Lamp animations are not a DB model.  This information
 * is in-memory only.
 */
export interface ILampAnimations {
  animationGuids: string[]
}

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
