import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AnimationItem, RGBW } from "engine/types"

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

export type IAnimationNew = Omit<IAnimation, "guid">

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

    setSolidColor: builder.mutation<string, { lampGuid: string; color: RGBW }>({
      invalidatesTags: ["animations"],
      query: ({ lampGuid, color }) => ({
        url: `devices/${lampGuid}/color`,
        method: "POST",
        body: color,
      }),
    }),

    addAnimation: builder.mutation<IAnimation, Omit<IAnimation, "guid">>({
      invalidatesTags: ["animations"],
      query: (animationData) => ({
        url: "animations",
        method: "POST",
        body: animationData,
      }),
    }),

    bulkSetAnimations: builder.mutation<
      string[],
      { deviceGuids: string[]; animationGuid: string; isOn: boolean }
    >({
      invalidatesTags: ["devices"],
      query: ({ deviceGuids, animationGuid, isOn }) => ({
        method: "POST",
        url: `devices/setBulkAnimations`,
        body: {
          deviceGuids,
          animationGuid,
          isOn,
        },
      }),
    }),

    removeAnimation: builder.mutation<string, string>({
      invalidatesTags: ["animations"],
      query: (animationGuid) => ({
        url: `animations/${animationGuid}`,
        method: "DELETE",
      }),
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
  }),
})

export const {
  useGetDevicesQuery,
  useAddDeviceMutation,
  useRemoveDeviceMutation,
  useGetAnimationsQuery,
  useRemoveAnimationMutation,
  useToggleAnimationMutation,
  useSetSolidColorMutation,
  useAddAnimationMutation,
  useBulkSetAnimationsMutation,
} = lampApi
