"use client"

import { SafetyMap } from "@/components/safety-map"
import { useState } from "react"
import { cn } from "@/lib/utils"

const FILTERS = ["All Incidents", "High Severity", "Medium", "Low", "Safe Places"]

export function MapView() {
  const [activeFilter, setActiveFilter] = useState("All Incidents")

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Live Safety Heatmap</h3>
          <p className="text-[12px] text-muted-foreground/60">7 incidents in 100m radius</p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                activeFilter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <SafetyMap fullscreen />
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
        {[
          { label: "High Risk", value: "2", color: "text-destructive" },
          { label: "Moderate", value: "3", color: "text-warning" },
          { label: "Safe Zones", value: "4", color: "text-success" },
          { label: "Help Centers", value: "3", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3">
            <span className="text-[11px] text-muted-foreground/60">{stat.label}</span>
            <span className={cn("text-lg font-semibold tabular-nums", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
