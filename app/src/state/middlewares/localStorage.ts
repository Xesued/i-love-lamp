// listenerMiddleware.ts
import { createListenerMiddleware, addListener } from "@reduxjs/toolkit"
import type { AppAddListener, AppStartListening, RootState } from "../store"

export const localStorageMiddleware = createListenerMiddleware()
localStorageMiddleware.startListening({
  /* Required in types, but documentation shows as optional. */
  predicate: () => true,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState // TODO: Improve typing?
    localStorage.setItem("lamps", JSON.stringify(state.lamps.value))
    return
  },
})

export const startAppListening =
  localStorageMiddleware.startListening as AppStartListening

export const addAppListener = addListener as AppAddListener
