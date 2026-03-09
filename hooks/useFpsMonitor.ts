// Lightweight FPS monitor — runs its own RAF loop to measure actual frame rate
// and detect dropped frames. Does no rendering work, just timestamps frames.

import { useEffect, useRef, useState } from 'react'

export interface FpsStats {
  /** Smoothed actual FPS (rolling average over window) */
  actualFps: number
  /** Percentage of frames that were dropped (elapsed > 2× target) in the window */
  droppedPercent: number
}

const WINDOW_SIZE = 60 // frames to track
const UPDATE_INTERVAL_MS = 500 // How often to push state updates (avoid re-render every frame)

export function useFpsMonitor(enabled: boolean, targetFps?: number): FpsStats {
  const [stats, setStats] = useState<FpsStats>({ actualFps: 0, droppedPercent: 0 })
  const timestampsRef = useRef<number[]>([])
  const rafRef = useRef(0)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      timestampsRef.current = []
      lastUpdateRef.current = 0
      setStats({ actualFps: 0, droppedPercent: 0 })
      return
    }

    const loop = (now: number) => {
      const stamps = timestampsRef.current
      stamps.push(now)

      // Trim to window size
      if (stamps.length > WINDOW_SIZE + 1) {
        stamps.splice(0, stamps.length - WINDOW_SIZE - 1)
      }

      // Only update React state at throttled interval to avoid churn
      if (stamps.length >= 2 && now - lastUpdateRef.current >= UPDATE_INTERVAL_MS) {
        lastUpdateRef.current = now

        // Calculate actual FPS from total window span
        const span = stamps[stamps.length - 1] - stamps[0]
        const frameCount = stamps.length - 1
        const actualFps = span > 0 ? (frameCount / span) * 1000 : 0

        // Count dropped frames: any gap > 2× the expected interval
        const expectedInterval = targetFps ? 1000 / targetFps : span / frameCount
        const dropThreshold = expectedInterval * 2
        let dropped = 0
        for (let i = 1; i < stamps.length; i++) {
          if (stamps[i] - stamps[i - 1] > dropThreshold) dropped++
        }
        const droppedPercent = frameCount > 0 ? (dropped / frameCount) * 100 : 0

        setStats({ actualFps: Math.round(actualFps), droppedPercent: Math.round(droppedPercent) })
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      timestampsRef.current = []
      lastUpdateRef.current = 0
    }
  }, [enabled, targetFps])

  return stats
}
