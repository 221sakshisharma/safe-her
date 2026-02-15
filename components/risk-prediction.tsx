"use client"

import { Activity } from "lucide-react"

const HOURS = [
  { hour: "6AM", risk: 15 },
  { hour: "8AM", risk: 25 },
  { hour: "10AM", risk: 12 },
  { hour: "12PM", risk: 18 },
  { hour: "2PM", risk: 14 },
  { hour: "4PM", risk: 22 },
  { hour: "6PM", risk: 35 },
  { hour: "8PM", risk: 55 },
  { hour: "10PM", risk: 72 },
  { hour: "12AM", risk: 68 },
  { hour: "2AM", risk: 45 },
  { hour: "4AM", risk: 30 },
]

function getBarColor(risk: number) {
  if (risk >= 60) return "bg-destructive/80"
  if (risk >= 35) return "bg-warning/80"
  return "bg-primary/60"
}

export function RiskPredictionChart() {
  const maxRisk = Math.max(...HOURS.map((h) => h.risk))

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Risk Prediction</h3>
        </div>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ML Model
        </span>
      </div>
      <div className="flex items-end justify-between gap-1" style={{ height: 120 }}>
        {HOURS.map((h) => {
          const heightPct = (h.risk / maxRisk) * 100
          return (
            <div key={h.hour} className="group flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full" style={{ height: 100 }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 ${getBarColor(h.risk)} group-hover:opacity-80`}
                  style={{ height: `${heightPct}%`, minHeight: 4 }}
                />
                <div className="absolute bottom-full mb-1 hidden w-full text-center group-hover:block">
                  <span className="text-[9px] font-medium text-foreground">
                    {h.risk}%
                  </span>
                </div>
              </div>
              <span className="text-[8px] text-muted-foreground">{h.hour}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <p className="text-[10px] text-muted-foreground">
          Peak risk: 10PM - 12AM
        </p>
        <div className="flex gap-2.5">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" /> Low
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-warning/80" /> Med
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/80" /> High
          </span>
        </div>
      </div>
    </div>
  )
}
