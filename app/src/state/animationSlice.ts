import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AnimationType } from "engine/types"
import * as colors from "engine/colors"
import type { AnimationItem } from "engine/types"

// TODO: Right now, only hard-coded animations.
const initalStateLoader: () => { value: AnimationItem[] } = () => {
  const value: AnimationItem[] = [
    {
      id: "123",
      name: "Bottom Slow",
      type: AnimationType.BLINK,
      onColor: [...colors.AMBER, 0],
      onDuration: 2000,
      offColor: [0, 0, 0, 0],
      offDuration: 2000,
      transition: 500,
      startLed: 0,
      endLed: 15,
    },
    {
      id: "234",
      name: "Top Fast",
      type: AnimationType.BLINK,
      onColor: [...colors.AQUA, 0],
      onDuration: 50,
      offColor: [...colors.GOLD, 0],
      offDuration: 50,
      transition: 100,
      startLed: 45,
    },
    {
      id: "345",
      name: "Red Alert",
      type: AnimationType.BLINK,
      onColor: [255, 0, 0, 0],
      onDuration: 100,
      offColor: [0, 0, 0, 0],
      offDuration: 100,
      transition: 100,
    },
    {
      id: "456",
      name: "Night Rider",
      type: AnimationType.BOUNCE,
      color: [255, 0, 0, 0],
      startLed: 0,
      endLed: 30,
      speed: 20,
    },
  ]

  return {
    value,
  }

  // const animationStr = localStorage.getItem("animations") || ""
  // try {
  //   let animations = JSON.parse(animationStr) as Animation[]
  //   return { value: animations}
  // } catch (e) {
  //   if (animationStr!== null) {
  //     console.warn(`Could not parse string: ${animationStr}`)
  //   }
  // }

  // return { value: [] as Animation[] }
}

export const animationsSlice = createSlice({
  name: "animations",
  initialState: initalStateLoader,
  reducers: {
    addAnimation: (state, action: PayloadAction<AnimationItem>) => {
      const hasAnimation = state.value.find((a) => a.id === action.payload.id)
      if (hasAnimation) {
        console.warn("Already have that animation")
        return
      }
      state.value.push(action.payload)
    },
    removeAnimation: (state, action: PayloadAction<string>) => {
      const animationIndex = state.value.findIndex(
        (a) => a.id === action.payload,
      )
      if (animationIndex < 0) {
        console.warn("No animation with id: ", action.payload)
        return
      }
      state.value.splice(animationIndex, 1)
    },
  },
})

export const { addAnimation, removeAnimation } = animationsSlice.actions
export default animationsSlice.reducer
