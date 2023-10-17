import { AnimationType } from "engine/types"
import type { AnimationItem, BlinkAnimation } from "engine/types"
import mongoose from "mongoose"

function isValidRGBValue(val: unknown) {
  if (typeof val !== "number") return false
  if (val < 0 || val > 255) return false
  return true
}

function isRGBW(val: unknown) {
  if (!Array.isArray(val)) return false
  if (val.length !== 4) return false
  if (val.findIndex((v) => !isValidRGBValue(v)) >= 0) return false
  return true
}

export class AnimationSchemaType extends mongoose.SchemaType {
  constructor(key: string, options?: mongoose.AnyObject) {
    super(key, options, "AnimationSchemaType")
  }

  cast(animationDef: any): AnimationItem {
    switch (animationDef.animationType) {
      case AnimationType.BLINK:
        if (!animationDef.onColor || !isRGBW(animationDef.onColor)) {
          throw new Error(
            `Blink animation onColor is required an needs to be 4 numbers between 0 and 255`
          )
        }

        if (!animationDef.offColor || !isRGBW(animationDef.offColor)) {
          throw new Error(
            `Blink animation offColor is required an needs to be 4 numbers between 0 and 255`
          )
        }

        if (
          !animationDef.onDuration ||
          typeof animationDef.onDuration !== "number"
        ) {
          throw new Error(
            `Blink animation onDuration is required an needs be a number`
          )
        }

        if (
          !animationDef.offDuration ||
          typeof animationDef.offDuration !== "number"
        ) {
          throw new Error(
            `Blink animation offDuration is required an needs be a number`
          )
        }

        if (
          !animationDef.transition ||
          typeof animationDef.transition !== "number"
        ) {
          throw new Error(
            `Blink animation offDuration is required an needs be a number`
          )
        }

        return animationDef as BlinkAnimation

      case AnimationType.BOUNCE:
      case AnimationType.SOLID:
        // TODO: Build out more validation

        return animationDef

      default:
        throw new Error(`Animation type not recognized: ${animationDef.type}`)
    }
  }
}

declare module "mongoose" {
  namespace Schema {
    namespace Types {
      class AnimationSchemaType extends SchemaType {}
    }
  }
}

mongoose.Schema.Types.AnimationSchemaType = AnimationSchemaType
