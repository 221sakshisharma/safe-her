"use client";

import { SafetyMap } from "@/components/safety-map";
import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSafety } from "@/context/safety-context";
import { PastActivities } from "@/components/past-activities";

const FILTERS = [
  "All Incidents",
  "High Severity",
  "Medium",
  "Low",
  "Safe Places",
];

export function MapView() {
  const { incidents, loading } = useSafety();
  const [activeFilter, setActiveFilter] = useState("All Incidents");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Live Safety Heatmap
            </h3>
            <p className="text-xs text-muted-foreground">
              {loading
                ? "Loading..."
                : `${incidents.length} incidents in your area`}
            </p>
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
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Full Map */}
        <div className="flex-1 rounded-xl border border-border overflow-hidden relative">
          <SafetyMap fullscreen />
        </div>

        {/* Sidebar List (Desktop) */}
        <div className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">
          <PastActivities incidents={incidents} />

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <h4 className="mb-2 text-sm font-semibold">Nearby Help</h4>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Police Stations</span>
                  <span className="font-bold text-foreground">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospitals</span>
                  <span className="font-bold text-foreground">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile List (Bottom) */}
      <div className="lg:hidden">
        <PastActivities incidents={incidents.slice(0, 3)} />
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
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
              <span className={cn("text-lg font-bold", stat.color)}>
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
