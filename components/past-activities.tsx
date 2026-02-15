"use client"

import { AlertTriangle, ShieldOff, Eye } from "lucide-react"

const ACTIVITIES = [
  {
    type: "Theft",
    icon: ShieldOff,
    count: 12,
    trend: "-15%",
    trendColor: "text-success",
    description: "Most common between 6-10PM",
  },
  {
    type: "Harassment",
    icon: AlertTriangle,
    count: 8,
    trend: "+5%",
    trendColor: "text-destructive",
    description: "Peak on weekends",
  },
  {
    type: "Suspicious Activity",
    icon: Eye,
    count: 15,
    trend: "-8%",
    trendColor: "text-success",
    description: "Concentrated near transit stops",
  },
]

export function PastActivities() {
  const total = ACTIVITIES.reduce((acc, a) => acc + a.count, 0)

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[13px] font-medium text-muted-foreground">Past Activities</h3>
        <span className="text-[11px] text-muted-foreground/60">Last 30 days</span>
      </div>
      <div className="mb-4">
        <span className="text-3xl font-semibold tracking-[-0.03em] text-foreground tabular-nums">
          {total}
        </span>
        <span className="ml-2 text-[11px] text-muted-foreground">total incidents</span>
      </div>
      <div className="flex flex-col gap-2">
        {ACTIVITIES.map((a) => (
          <div
            key={a.type}
            className="flex items-center gap-3 rounded-xl bg-accent/40 px-3 py-2.5 transition-colors hover:bg-accent/70"
          >
            <a.icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">{a.type}</p>
              <p className="text-[10px] text-muted-foreground/60">{a.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-semibold text-foreground tabular-nums">{a.count}</span>
              <span className={`text-[10px] font-medium ${a.trendColor}`}>{a.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
