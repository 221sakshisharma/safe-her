"use client"

import { Clock, TrendingDown, TrendingUp, Eye, ShieldAlert, Activity } from "lucide-react"
import { SafetyScoreRing, SafetyScoreBreakdown } from "@/components/safety-score"
import { SafetyMap } from "@/components/safety-map"
import { RiskPredictionChart } from "@/components/risk-prediction"
import { PastActivities } from "@/components/past-activities"

const SCORE_FACTORS = [
  { label: "Incident Frequency", value: 22, max: 30 },
  { label: "Severity Index", value: 18, max: 25 },
  { label: "Recency Factor", value: 12, max: 20 },
  { label: "Lighting & Infrastructure", value: 15, max: 15 },
  { label: "Community Reports", value: 5, max: 10 },
]

const STATS = [
  {
    label: "Incidents (24h)",
    value: "3",
    trend: "down" as const,
    icon: ShieldAlert,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Risk Level",
    value: "Low",
    trend: "down" as const,
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Active Alerts",
    value: "1",
    trend: "up" as const,
    icon: Eye,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Last Updated",
    value: "2m ago",
    trend: null,
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
]

export function DashboardView() {
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-primary/5 border border-primary/10 px-5 py-4 animate-fade-in">
        <p className="text-sm font-medium text-foreground">
          Good evening, Sarah
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Your area safety score is moderate. Stay aware after 8 PM.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-sm animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-105`}
              >
                <stat.icon className={`h-[18px] w-[18px] ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-lg font-semibold text-foreground tabular-nums">
                    {stat.value}
                  </p>
                  {stat.trend === "down" && (
                    <TrendingDown className="h-3.5 w-3.5 text-success" />
                  )}
                  {stat.trend === "up" && (
                    <TrendingUp className="h-3.5 w-3.5 text-destructive" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        {/* Safety Score */}
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Safety Score</h3>
          </div>
          <div className="flex flex-col items-center gap-6 pb-2">
            <SafetyScoreRing score={72} />
            <div className="w-full">
              <SafetyScoreBreakdown factors={SCORE_FACTORS} />
            </div>
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Score based on incident frequency, severity, recency, infrastructure, and community data within 100m radius.
            </p>
          </div>
        </div>

        {/* Map + Activities */}
        <div className="flex flex-col gap-5 lg:col-span-2 lg:gap-6">
          <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Live Safety Map</h3>
            </div>
            <SafetyMap />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <PastActivities />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
              <RiskPredictionChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
