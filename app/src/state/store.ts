import { configureStore } from "@reduxjs/toolkit"
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit"
import { lampApi } from "../api/lampApi"

export const store = configureStore({
  reducer: {
    [lampApi.reducerPath]: lampApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lampApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState, AppDispatch>
