import { AnimationItem, AnimationType, BlinkAnimation } from "engine/types"

import {
  Attributes,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../setupMariaDB"

export class AnimationModel extends Model<
  InferAttributes<AnimationModel>,
  InferCreationAttributes<AnimationModel>
> {
  declare guid: CreationOptional<string>
  declare name: string
  declare details: AnimationItem
}

AnimationModel.init(
  {
    guid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.TEXT, allowNull: false },
    details: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidAnimationDef,
      },
    },
  },
  {
    tableName: "animations",
    sequelize,
  }
)

export type IAnimation = Attributes<AnimationModel>

function isValidAnimationDef(animationDef: AnimationItem) {
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
      // @ts-ignore-line
      throw new Error(`Animation type not recognized: ${animationDef.type}`)
  }
}

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
