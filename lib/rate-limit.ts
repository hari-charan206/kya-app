
const requestLog = new Map<string, number[]>()


export function isRateLimited(key: string, maxRequests = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs)
  timestamps.push(now)
  requestLog.set(key, timestamps)
  return timestamps.length > maxRequests
}