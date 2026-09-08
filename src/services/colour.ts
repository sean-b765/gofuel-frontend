export function createPriceColor(prices: number[]) {
  const sorted = prices
    .filter((price) => !Number.isNaN(price))
    .sort((a, b) => a - b)

  const quantile = (q: number) => {
    if (sorted.length === 0) return 0
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const next = sorted[base + 1] ?? sorted[base]
    return sorted[base] + (pos - base) * (next - sorted[base])
  }

  const low = quantile(0.1)
  const mid = quantile(0.5)
  const high = quantile(0.9)

  return (price: number) => {
    if (Number.isNaN(price)) return "#888"
    let t
    if (price <= mid) {
      t = mid === low ? 0 : (0.5 * (price - low)) / (mid - low)
    } else {
      t = high === mid ? 1 : 0.5 + (0.5 * (price - mid)) / (high - mid)
    }
    t = Math.max(0, Math.min(1, t))

    // Green -> amber -> red, with the midpoint landing on orange rather
    // than yellow so mid-priced markers stay readable on a light map.
    const hue =
      t <= 0.5 ? 135 - 100 * (t / 0.5) : 35 - 30 * ((t - 0.5) / 0.5)
    return `hsl(${hue}, 55%, 42%)`
  }
}
