import { Schema, model } from "mongoose"
import { AnimationItem } from "engine/types"

// Builds and registers the Animation type
import { AnimationSchemaType } from "../utils/animationSchemaType"

export interface IAnimation {
  guid: string
  name: string
  details: AnimationItem
}

const schema = new Schema<IAnimation>({
  guid: { type: String, required: true },
  name: { type: String, required: true },
  details: { type: AnimationSchemaType, required: true },
})

export const AnimationModel = model<IAnimation>("Animation", schema)
