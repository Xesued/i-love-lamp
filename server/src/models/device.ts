import fs from "fs/promises"
import { parse, stringify } from "yaml"

export type IDevice = {
  guid: string
  name: string
  description: string
  currentIP: string
  macAddress: string
  numOfLeds: number
}

const DEVICES_FILE = "data/devices.yml"

export async function getDevices(): Promise<IDevice[]> {
  const file = await fs.readFile(DEVICES_FILE, "utf-8")
  const deviceDB = parse(file)
  return deviceDB.devices as IDevice[]
}

async function saveDevices(devices: IDevice[]): Promise<boolean> {
  const yaml = stringify({ devices })
  await fs.writeFile(DEVICES_FILE, yaml)
  return true
}

export async function addDevices(devices: IDevice[]): Promise<boolean> {
  const currentDevices = await getDevices()
  const newDevices = currentDevices.concat(devices)
  return await saveDevices(newDevices)
}

export async function updateDevice(
  guid: string,
  parts: Partial<IDevice>
): Promise<IDevice> {
  return {
    guid,
    name: "",
    description: "",
    currentIP: "",
    macAddress: "",
    numOfLeds: 20,
  }
}

export async function deleteDevice(guid: string): Promise<boolean> {
  console.log("TODO: delete", guid)
  return false
}

export async function getDevice(guid: string): Promise<IDevice | undefined> {
  const devices = await getDevices()
  return devices.find((d) => d.guid === guid)
}

export async function getDevicesByIds(guids: string[]): Promise<IDevice[]> {
  const devices = await getDevices()
  return devices.filter((d) => guids.includes(d.guid))
}
