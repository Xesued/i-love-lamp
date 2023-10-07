import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type Lamp = {
  name: string
  // TODO: Keying off a name is odd, but works for my
  // simple use case.
  animations: string[]
}
export type LampMap = { [ip: number]: Lamp }

const initalStateLoader = () => {
  const lampStr = localStorage.getItem("lamps") || ""
  try {
    let lamps = JSON.parse(lampStr) as LampMap
    return { value: lamps }
  } catch (e) {
    if (lampStr !== null) {
      console.warn(`Could not parse string: ${lampStr}`)
    }
  }

  return { value: {} as LampMap }
}

export const lampSlice = createSlice({
  name: "lamps",
  initialState: initalStateLoader,
  reducers: {
    addLamp: (
      state,
      action: PayloadAction<{ id: number; lamp: Pick<Lamp, "name"> }>,
    ) => {
      state.value[action.payload.id] = {
        ...action.payload.lamp,
        animations: [],
      }
    },
    removeLamp: (state, action: PayloadAction<number>) => {
      delete state.value[action.payload]
    },
    toggleLampAnimation: (
      state,
      action: PayloadAction<{ ip: number; animationName: string }>,
    ) => {
      const { ip, animationName } = action.payload
      const animationIndex = state.value[ip]?.animations.findIndex(
        (an) => an === animationName,
      )

      if (animationIndex > -1) {
        state.value[ip].animations.splice(animationIndex, 1)
      } else {
        state.value[ip].animations.push(animationName)
      }
    },
  },
})

export const { addLamp, removeLamp, toggleLampAnimation } = lampSlice.actions
export default lampSlice.reducer
