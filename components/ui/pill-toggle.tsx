'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface PillToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  labelOn?: string
  labelOff?: string
  className?: string
}

const activeClass = 'bg-primary/20 text-primary border border-primary/40'
const inactiveClass = 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
const baseClass = 'px-2 py-0.5 rounded text-sm font-mono font-bold tracking-wide transition-colors'

export const PillToggle = memo(function PillToggle({
  checked,
  onChange,
  labelOn = 'ON',
  labelOff = 'OFF',
  className,
}: PillToggleProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        aria-pressed={checked}
        onClick={() => onChange(true)}
        className={`${baseClass} ${checked ? activeClass : inactiveClass}`}
      >
        {labelOn}
      </button>
      <button
        aria-pressed={!checked}
        onClick={() => onChange(false)}
        className={`${baseClass} ${!checked ? activeClass : inactiveClass}`}
      >
        {labelOff}
      </button>
    </div>
  )
})
