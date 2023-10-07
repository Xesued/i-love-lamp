import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { AnimationItem } from "engine/types"

export const animationApi = createApi({
  reducerPath: "animationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:3000" }),
  endpoints: (builder) => ({
    addAnimation: builder.query<AnimationItem, string>({
      query: (name) => `animation/${name}?`
    })
  })
})
