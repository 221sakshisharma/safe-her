"use client"

import { History, AlertTriangle, ShieldOff, Eye } from "lucide-react"

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
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Past Activities</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">Last 30 days</span>
      </div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground tabular-nums">{total}</span>
        <span className="text-[11px] text-muted-foreground">total incidents</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {ACTIVITIES.map((a) => (
          <div
            key={a.type}
            className="flex items-start gap-3 rounded-xl bg-accent/50 px-3.5 py-3 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <a.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-foreground">{a.type}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-foreground tabular-nums">
                    {a.count}
                  </span>
                  <span className={`text-[10px] font-medium ${a.trendColor}`}>
                    {a.trend}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
