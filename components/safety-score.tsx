"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function getScoreColor(score: number) {
  if (score >= 75) return { text: "text-success", stroke: "hsl(162, 48%, 45%)" }
  if (score >= 50) return { text: "text-warning", stroke: "hsl(38, 80%, 58%)" }
  return { text: "text-destructive", stroke: "hsl(0, 60%, 58%)" }
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Safe"
  if (score >= 50) return "Moderate"
  return "High Risk"
}

export function SafetyScoreRing({
  score,
  size = 160,
  strokeWidth = 6,
}: {
  score: number
  size?: number
  strokeWidth?: number
}) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference
  const { text, stroke } = getScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1200ms] ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${stroke}40)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-[40px] font-semibold tracking-[-0.04em] tabular-nums", text)}>
          {animatedScore}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  )
}

export function SafetyScoreBreakdown({
  factors,
}: {
  factors: { label: string; value: number; max: number }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      {factors.map((f) => {
        const pct = (f.value / f.max) * 100
        const color =
          pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive"
        return (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{f.label}</span>
              <span className="font-medium text-foreground tabular-nums">
                {f.value}/{f.max}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
