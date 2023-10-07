import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type Lamp = {
  name: string
  isActive: boolean
}
export type LampMap = { [ip: number]: Lamp }

const DEFAULT: LampMap = {}
export const lampSlice = createSlice({
  name: "lamp",
  initialState: {
    value: DEFAULT,
  },
  reducers: {
    addLamp: (
      state,
      action: PayloadAction<{ id: number; lamp: Pick<Lamp, "name"> }>,
    ) => {
      state.value[action.payload.id] = {
        ...action.payload.lamp,
        isActive: false,
      }
    },
    removeLamp: (state, action: PayloadAction<number>) => {
      delete state.value[action.payload]
    },
    toggleLamp: (state, action: PayloadAction<number>) => {
      const ip = action.payload
      if (state.value[ip]) {
        state.value[ip].isActive = !state.value[ip].isActive
      }
    },
  },
})

export const { addLamp, removeLamp, toggleLamp } = lampSlice.actions
export default lampSlice.reducer
