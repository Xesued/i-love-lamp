import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AnimationItem } from "engine/types"
import { stringify } from "uuid"

// TODO: Build a common "API" schema shared between
// the server an app

export interface ILamp {
  guid: string
  name: string
  currentIP: string
  numOfLeds: number
  animationGuids: string[]
}

export interface IAnimation {
  guid: string
  name: string
  details: AnimationItem
}

const BASE_URL = import.meta.env.VITE_API_URL

export const lampApi = createApi({
  reducerPath: "lampApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["devices", "animations"],
  endpoints: (builder) => ({
    getDevices: builder.query<ILamp[], void>({
      providesTags: ["devices"],
      query: () => "devices",
    }),

    addDevice: builder.mutation<ILamp, Omit<ILamp, "guid" | "animationGuids">>({
      invalidatesTags: ["devices"],
      query: (lampData) => ({
        url: `devices`,
        method: "POST",
        body: lampData,
      }),
    }),

    removeDevice: builder.mutation<string, string>({
      query: (lampGuid) => ({
        url: `devices/${lampGuid}`,
        method: "DELETE",
      }),
    }),

    getAnimations: builder.query<IAnimation[], void>({
      providesTags: ["animations"],
      query: () => "animations",
    }),

    toggleAnimation: builder.mutation<
      string,
      { deviceGuid: string; animationGuid: string }
    >({
      invalidatesTags: ["devices"],
      query: ({ deviceGuid, animationGuid }) => ({
        method: "POST",
        url: `devices/${deviceGuid}/toggleAnimation/${animationGuid}`,
      }),
    }),

    // /**
    //  * Get the details of a specific device
    //  * TODO: with so few devices, I think just the list works for now
    //  */
    // getDevice: builder.query<AnimationItem, string>({
    //   query: (name) => `${name}?`,
    // }),

    // removeDevice: builder.mutation<string, string>({
    //   query: ()
    // })
  }),
})

export const {
  useGetDevicesQuery,
  useAddDeviceMutation,
  useRemoveDeviceMutation,
  useGetAnimationsQuery,
  useToggleAnimationMutation,
} = lampApi
