import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Lamp = {
  guid: string
  name: string
  current_ip: string
  num_of_leds: number
}

const BASE_URL = import.meta.env.VITE_API_URL

export const lampApi = createApi({
  reducerPath: "lampApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    /**
     * Fetch all of the devices
     */
    getDevices: builder.query<Lamp[], void>({
      query: () => "devices",
    }),

    addDevice: builder.mutation<Lamp, Omit<Lamp, "guid">>({
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
} = lampApi
