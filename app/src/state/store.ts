import { configureStore } from "@reduxjs/toolkit"
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit"
import { animationApi } from "../api/animation"

import lampReducer from "./lampSlice"
import animationsReducer from "./animationSlice"

import { localStorageMiddleware } from "./middlewares/localStorage"

export const store = configureStore({
  reducer: {
    lamps: lampReducer,
    animations: animationsReducer,

    // TODO: Move animations above to just this reducer?
    [animationApi.reducerPath]: animationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      localStorageMiddleware.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState, AppDispatch>
