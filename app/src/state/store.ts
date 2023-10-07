import { configureStore } from "@reduxjs/toolkit"
import lampReducer from "./lampSlice"

export const store = configureStore({
  reducer: {
    lamps: lampReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
