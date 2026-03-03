'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'
import { freqToLogPosition, clamp } from '@/lib/utils/mathHelpers'
import { CANVAS_SETTINGS } from '@/lib/dsp/constants'
import type { SpectrumData } from '@/types/advisory'

interface WaterfallCanvasProps {
  spectrum: SpectrumData | null
  isRunning: boolean
  graphFontSize?: number
}

// History size for time scrolling
const HISTORY_SIZE = 200

export function WaterfallCanvas({ spectrum, isRunning, graphFontSize = 11 }: WaterfallCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const historyRef = useRef<Float32Array[]>([])
  const frameTimesRef = useRef<number[]>([])
  const lastSpectrumRef = useRef<number>(0)

  // Handle resize - set canvas size to match container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)
      
      if (width === 0 || height === 0) return
      
      dimensionsRef.current = { width, height }

      const canvas = canvasRef.current
      if (canvas) {
        // Set canvas to exact pixel dimensions (no DPR scaling - simpler and avoids zoom issues)
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }

    const observer = new ResizeObserver(() => updateSize())
    observer.observe(container)
    updateSize() // Initial size

    return () => observer.disconnect()
  }, [])

  // Update history with new spectrum data
  useEffect(() => {
    if (!spectrum?.freqDb || !isRunning) return
    if (spectrum.timestamp === lastSpectrumRef.current) return

    lastSpectrumRef.current = spectrum.timestamp

    const copy = new Float32Array(spectrum.freqDb)
    historyRef.current.push(copy)
    frameTimesRef.current.push(Date.now())

    while (historyRef.current.length > HISTORY_SIZE) {
      historyRef.current.shift()
      frameTimesRef.current.shift()
    }
  }, [spectrum, isRunning])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    // Padding in CSS pixels
    const padding = { top: 8, right: 8, bottom: 18, left: 32 }
    const plotWidth = width - padding.left - padding.right
    const plotHeight = height - padding.top - padding.bottom

    if (plotWidth <= 0 || plotHeight <= 0) return

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    const history = historyRef.current
    const { RTA_DB_MIN, RTA_DB_MAX, RTA_FREQ_MIN, RTA_FREQ_MAX } = CANVAS_SETTINGS
    const currentSpectrum = spectrum

    // Draw empty plot area if no data
    if (history.length === 0 || !currentSpectrum?.sampleRate || !currentSpectrum?.fftSize) {
      ctx.fillStyle = '#111'
      ctx.fillRect(padding.left, padding.top, plotWidth, plotHeight)
      drawAxes()
      return
    }

    const hzPerBin = currentSpectrum.sampleRate / currentSpectrum.fftSize
    const binCount = history[0]?.length ?? 0
    const numRows = history.length

    // Pre-compute log frequency mapping
    const logFreqMin = Math.log10(RTA_FREQ_MIN)
    const logFreqRange = Math.log10(RTA_FREQ_MAX) - logFreqMin

    // Draw waterfall row by row
    for (let row = 0; row < numRows; row++) {
      const spectrumRow = history[numRows - 1 - row] // Newest at top
      if (!spectrumRow) continue

      // Calculate Y position - distribute rows evenly across plot height
      const y = padding.top + Math.floor((row / HISTORY_SIZE) * plotHeight)
      const nextY = padding.top + Math.floor(((row + 1) / HISTORY_SIZE) * plotHeight)
      const rowHeight = Math.max(1, nextY - y)

      // Draw each frequency column
      for (let x = 0; x < plotWidth; x++) {
        // Map x position to frequency (logarithmic scale)
        const logPos = x / plotWidth
        const freq = Math.pow(10, logFreqMin + logPos * logFreqRange)
        const bin = Math.round(freq / hzPerBin)

        if (bin < 1 || bin >= binCount) continue

        const db = clamp(spectrumRow[bin], RTA_DB_MIN, RTA_DB_MAX)
        const normalized = (db - RTA_DB_MIN) / (RTA_DB_MAX - RTA_DB_MIN)

        // Color mapping: black -> blue -> cyan -> green -> yellow -> red
        ctx.fillStyle = getWaterfallColor(normalized)
        ctx.fillRect(padding.left + x, y, 1, rowHeight)
      }
    }

    drawAxes()

    function getWaterfallColor(t: number): string {
      // t is 0-1 normalized amplitude
      if (t < 0.15) {
        // Black to deep blue
        const v = t / 0.15
        return `rgb(0, 0, ${Math.floor(v * 100)})`
      } else if (t < 0.3) {
        // Deep blue to blue
        const v = (t - 0.15) / 0.15
        return `rgb(0, ${Math.floor(v * 60)}, ${Math.floor(100 + v * 80)})`
      } else if (t < 0.45) {
        // Blue to cyan
        const v = (t - 0.3) / 0.15
        return `rgb(0, ${Math.floor(60 + v * 140)}, ${Math.floor(180 - v * 20)})`
      } else if (t < 0.6) {
        // Cyan to green
        const v = (t - 0.45) / 0.15
        return `rgb(${Math.floor(v * 50)}, ${Math.floor(200 + v * 55)}, ${Math.floor(160 - v * 160)})`
      } else if (t < 0.75) {
        // Green to yellow
        const v = (t - 0.6) / 0.15
        return `rgb(${Math.floor(50 + v * 205)}, 255, 0)`
      } else if (t < 0.9) {
        // Yellow to orange
        const v = (t - 0.75) / 0.15
        return `rgb(255, ${Math.floor(255 - v * 128)}, 0)`
      } else {
        // Orange to red
        const v = (t - 0.9) / 0.1
        return `rgb(255, ${Math.floor(127 - v * 127)}, 0)`
      }
    }

    function drawAxes() {
      const times = frameTimesRef.current
      const numFrames = times.length
      const nowMs = times[numFrames - 1] ?? Date.now()
      const oldestMs = times[0] ?? nowMs
      const totalMs = Math.max(1, nowMs - oldestMs)

      ctx.fillStyle = '#888'
      ctx.font = `${graphFontSize}px system-ui, sans-serif`

      // Time axis (left side)
      ctx.textAlign = 'right'
      ctx.fillText('Now', padding.left - 4, padding.top + 10)

      // Draw time ticks
      const intervals = [1000, 2000, 5000, 10000, 30000]
      let tickInterval = intervals[0]
      for (const iv of intervals) {
        if (totalMs / iv <= 4) { tickInterval = iv; break }
        tickInterval = iv
      }

      if (numFrames > 1) {
        let tickMs = Math.floor(nowMs / tickInterval) * tickInterval
        while (tickMs > oldestMs) {
          const age = nowMs - tickMs
          const yFrac = age / totalMs
          const y = padding.top + yFrac * plotHeight

          if (y >= padding.top + 15 && y <= padding.top + plotHeight - 5) {
            ctx.fillText(`${Math.round(age / 1000)}s`, padding.left - 4, y + 4)

            ctx.strokeStyle = '#333'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(padding.left, y)
            ctx.lineTo(padding.left + plotWidth, y)
            ctx.stroke()
          }
          tickMs -= tickInterval
        }
      }

      // Frequency axis (bottom)
      ctx.textAlign = 'center'
      const freqLabels = [100, 1000, 10000]
      for (const freq of freqLabels) {
        const xPos = padding.left + freqToLogPosition(freq, RTA_FREQ_MIN, RTA_FREQ_MAX) * plotWidth
        const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`
        ctx.fillText(label, xPos, height - 4)
      }

      // Plot border
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 1
      ctx.strokeRect(padding.left, padding.top, plotWidth, plotHeight)
    }

  }, [spectrum, graphFontSize])

  useAnimationFrame(render, isRunning || historyRef.current.length > 0)

  const showPlaceholder = !isRunning && historyRef.current.length === 0

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#0a0a0a]">
      {showPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          {/* Stylized waterfall preview */}
          <div className="w-40 h-24 rounded overflow-hidden relative border border-border/30">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, 
                  #000 0%, 
                  #001030 20%, 
                  #003060 35%, 
                  #006060 50%, 
                  #008040 62%, 
                  #60c000 74%, 
                  #c0c000 85%, 
                  #ff6000 95%, 
                  #ff0000 100%
                )`,
              }}
            />
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Waterfall Spectrogram</p>
            <p className="text-muted-foreground/50 text-[10px] mt-0.5">Press Start to begin</p>
          </div>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0" 
          role="img" 
          aria-label="Waterfall spectrogram" 
        />
      )}
    </div>
  )
}
