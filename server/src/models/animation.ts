import fs from "fs/promises"
import { parse } from "yaml"

import { AnimationItem, AnimationType, BlinkAnimation } from "engine/types"

export type IAnimation = {
  guid: string
  name: string
  details: AnimationItem
}

export async function getAnimations(): Promise<IAnimation[]> {
  const file = await fs.readFile("data/animations.yml", "utf-8")
  const animationDB = parse(file)

  // TODO: parse and validate...
  return animationDB.animations as IAnimation[]
}

export async function createAnimation(
  parts: Partial<IAnimation>
): Promise<IAnimation | null> {
  return null
}

export async function updateAnimation(
  guid: string,
  parts: Partial<IAnimation>
): Promise<IAnimation | null> {
  console.log("TODO: update", guid, parts)
  return null
}

export async function deleteAnimation(guid: string): Promise<boolean> {
  console.log("TODO: delete", guid)
  return false
}

export async function getAnimation(
  guid: string
): Promise<IAnimation | undefined> {
  const animations = await getAnimations()
  return animations.find((a) => a.guid === guid)
}

export async function getAnimationsByGuids(
  guids: string[]
): Promise<IAnimation[]> {
  const animations = await getAnimations()
  return animations.filter((a) => guids.includes(a.guid))
}

export function isValidAnimationDef(animationDef: AnimationItem) {
  switch (animationDef.type) {
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
