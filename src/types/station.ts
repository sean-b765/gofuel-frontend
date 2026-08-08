export type Prices = {
  Ulp91: number
  Ulp95: number
  Ulp98: number
  Diesel: number
}

export type Station = {
  Title: string
  Brand: string
  Date: string
  Price: Prices
  Location: string
  Address: string
  Phone: string
  Latitude: string
  Longitude: string
}
