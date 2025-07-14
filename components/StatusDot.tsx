"use client"

interface Props {
  active: boolean
  lastSync: string | null
}

export default function StatusDot({ active, lastSync }: Props) {
  const color = (() => {
    if (!active) return 'bg-gray-400'
    if (lastSync) {
      const diff = Date.now() - new Date(lastSync).getTime()
      if (diff > 1000 * 60 * 60 * 24) return 'bg-red-500'
    }
    return 'bg-green-500'
  })()

  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
}
