"use client"

import { SafetyMap } from "@/components/safety-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const FILTERS = ["All Incidents", "High Severity", "Medium", "Low", "Safe Places"]

export function MapView() {
  const [activeFilter, setActiveFilter] = useState("All Incidents")

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Live Safety Heatmap</h3>
            <p className="text-xs text-muted-foreground">7 incidents in 100m radius</p>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Full Map */}
      <div className="flex-1">
        <SafetyMap fullscreen />
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "High Risk Zones", value: "2", color: "text-destructive" },
          { label: "Moderate Zones", value: "3", color: "text-warning" },
          { label: "Safe Zones", value: "4", color: "text-success" },
          { label: "Help Centers", value: "3", color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
