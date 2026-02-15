"use client"

import { SafetyMap } from "@/components/safety-map"
import { Map } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const FILTERS = ["All Incidents", "High Severity", "Medium", "Low", "Safe Places"]

export function MapView() {
  const [activeFilter, setActiveFilter] = useState("All Incidents")

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Map className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Live Safety Heatmap</h3>
            <p className="text-[11px] text-muted-foreground">7 incidents in 100m radius</p>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
                activeFilter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-accent text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Full Map */}
      <div className="flex-1 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <SafetyMap fullscreen />
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {[
          { label: "High Risk Zones", value: "2", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Moderate Zones", value: "3", color: "text-warning", bg: "bg-warning/10" },
          { label: "Safe Zones", value: "4", color: "text-success", bg: "bg-success/10" },
          { label: "Help Centers", value: "3", color: "text-primary", bg: "bg-primary/10" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5"
          >
            <span className="text-[11px] font-medium text-muted-foreground">
              {stat.label}
            </span>
            <span className={cn("text-lg font-semibold", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
