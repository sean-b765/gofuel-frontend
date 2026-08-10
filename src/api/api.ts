import axios from "axios"
import Emitter from "../services/eventemitter"
import { FetchNearestResponse } from "../types/dto"
import { Journey } from "../types/util"

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

API.interceptors.request.use((req: any) => {
  Emitter.emit("AXIOS_START", true)
  return req
})
API.interceptors.response.use(
  (res: any) => {
    Emitter.emit("AXIOS_STOP", true)
    return res
  },
  (err: Error) => {
    Emitter.emit("AXIOS_STOP", false)
    throw err
  }
)

export async function fetchNearest(
  topLeft: string,
  bottomRight: string,
  signal?: AbortSignal
): Promise<FetchNearestResponse | Error> {
  try {
    return (await API.get(`/current?topLeft=${topLeft}&bottomRight=${bottomRight}`, { signal })).data
  } catch (err) {
    return err as Error
  }
}

export async function fetchJourney(
  origin: string,
  destination: string
): Promise<Journey | Error> {
  try {
    return (
      await API.get(`/journey?origin=${origin}&destination=${destination}`)
    ).data
  } catch (err) {
    return err as Error
  }
}
