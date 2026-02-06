"use client"

import { History, AlertTriangle, ShieldOff, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-primary" />
            Past Activities
          </CardTitle>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">total incidents</span>
        </div>
        <div className="flex flex-col gap-3">
          {ACTIVITIES.map((a) => (
            <div
              key={a.type}
              className="flex items-start gap-3 rounded-lg bg-secondary/50 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                <a.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{a.type}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-foreground">{a.count}</span>
                    <span className={`text-[10px] font-medium ${a.trendColor}`}>{a.trend}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
