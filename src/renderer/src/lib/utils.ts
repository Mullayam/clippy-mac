export function getRelativeTime(timestamp: number): string {
  const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000)
  if (diffInSeconds < 60) return 'Now'
  const m = Math.floor(diffInSeconds / 60)
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.floor(m / 60)}h`
  return `${Math.floor(m / 1440)}d`
}
