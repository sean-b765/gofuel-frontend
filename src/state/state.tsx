import { create } from "zustand"
import { Station } from "../types/station"
import { Coordinate, Journey } from "../types/util"

export type AppState = {
  stations: Station[]
  journey?: Journey
  selectedStation?: Station
  userLocation?: Coordinate
  date?: string

  setStations: (v: Station[]) => void
  setJourney: (v: Journey | undefined) => void
  setSelectedStation: (v: Station | undefined) => void
  setUserLocation: (v: Coordinate) => void
  setDate: (v: string) => void
}

export const useStore = create<AppState>((set) => ({
  stations: [],
  journey: undefined,
  selectedStation: undefined,
  userLocation: undefined,
  date: undefined,

  setStations: (stations: Station[]) => set({ stations }),
  setJourney: (journey: Journey | undefined) => set({ journey }),
  setSelectedStation: (selectedStation: Station | undefined) =>
    set({ selectedStation }),
  setUserLocation: (userLocation: Coordinate) => set({ userLocation }),
  setDate: (date: string) => set({ date }),
}))
