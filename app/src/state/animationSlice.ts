import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AnimationType } from "engine/types"
import * as colors from "engine/colors"
import type { AnimationItem } from "engine/types"

// TODO: Right now, only hard-coded animations.
const initalStateLoader: () => { value: AnimationItem[] } = () => {
  const value: AnimationItem[] = [
    {
      id: "12",
      name: "Solid White",
      type: AnimationType.SOLID,
      color: [0, 0, 0, 255],
    },
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
      name: "Pretty",
      type: AnimationType.BLINK,
      onColor: [...colors.AQUA, 0],
      onDuration: 10,
      offColor: [...colors.GOLD, 0],
      offDuration: 10,
      transition: 500,
    },
    {
      id: "345",
      name: "Red Alert",
      type: AnimationType.BLINK,
      onColor: [255, 0, 0, 0],
      onDuration: 2000,
      offColor: [0, 0, 0, 0],
      offDuration: 100,
      transition: 500,
    },
    {
      id: "456",
      name: "Night Rider",
      type: AnimationType.BOUNCE,
      color: [255, 0, 0, 0],
      speed: 1,
    },
  ]

  const animationStr = localStorage.getItem("animations") || ""
  try {
    let animations = JSON.parse(animationStr) as Animation[]
    console.log(animations)
    // return { value: animations}
  } catch (e) {
    if (animationStr !== null) {
      console.warn(`Could not parse string: ${animationStr}`)
    }
  }

  return {
    value,
  }

  // return { value: [] as Animation[] }
}

export const animationsSlice = createSlice({
  name: "animations",
  initialState: initalStateLoader,
  reducers: {
    addAnimation: (state, action: PayloadAction<AnimationItem>) => {
      const animationIndex = state.value.findIndex(
        (a) => a.id === action.payload.id,
      )
      if (animationIndex !== -1) {
        // Edit the animation...
        state.value[animationIndex] = action.payload
      } else {
        state.value.push(action.payload)
      }
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
