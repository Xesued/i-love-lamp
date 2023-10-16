import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { AnimationItem } from "engine/types"

const BASE_URL = process.env.VITE_API_URL

export const animationApi = createApi({
  reducerPath: "animationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/animations`,
  }),
  endpoints: (builder) => ({
    getAnimations: builder.query<AnimationItem[], void>({
      query: () => `/`,
    }),
    // addAnimation: builder.query<AnimationItem, string>({
    //   query: (name) => `${name}?`,
    // }),
    // removeAnimation: builder.mutation<string, string>({
    //   query: ()
    // })
  }),
})
