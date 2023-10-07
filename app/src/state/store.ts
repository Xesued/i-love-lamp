import { configureStore } from "@reduxjs/toolkit"
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'

import lampReducer from "./lampSlice"
import { localStorageMiddleware } from "./middlewares/localStorage"

export const store = configureStore({
  reducer: {
    lamps: lampReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState, AppDispatch>