import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AnimationType } from "engine/types"
import type { AnimationItem } from "engine/types"

// TODO: Append more animations as they are added in.

const initalStateLoader: () => { value: AnimationItem[] } = () => {
  const value: AnimationItem[] = [
    {
      id: 1,
      name: "On/Off",
      type: AnimationType.BLINK,
      onColor: [255, 0, 0, 0],
      onDuration: 100,
      offColor: [0, 0, 0, 0],
      offDuration: 100,
      transition: 100,
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
        console.warn("Already have an animation by that name")
        return
      }
      state.value.push(action.payload)
    },
    removeAnimation: (state, action: PayloadAction<number>) => {
      const animationIndex = state.value.findIndex(
        (a) => a.id === action.payload,
      )
      if (animationIndex < 0) {
        console.warn(`No animation by that name: ${action.payload}`)
        return
      }
      state.value.splice(animationIndex, 1)
    },
  },
})

export const { addAnimation, removeAnimation } = animationsSlice.actions
export default animationsSlice.reducer
