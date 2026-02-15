"use client"

import { TrendingDown, TrendingUp, ShieldCheck, Activity, Eye, Clock } from "lucide-react"
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
    icon: ShieldCheck,
    accent: "text-success",
  },
  {
    label: "Risk Level",
    value: "Low",
    trend: "down" as const,
    icon: Activity,
    accent: "text-primary",
  },
  {
    label: "Active Alerts",
    value: "1",
    trend: "up" as const,
    icon: Eye,
    accent: "text-warning",
  },
  {
    label: "Last Updated",
    value: "2m ago",
    trend: null,
    icon: Clock,
    accent: "text-muted-foreground",
  },
]

export function DashboardView() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
          Good evening, Sarah
        </h1>
        <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
          Your area is relatively safe right now. Stay aware after dark.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-border/60 bg-card p-4 transition-all duration-300 hover:border-border animate-fade-in-up"
            style={{ animationDelay: `${i * 70 + 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-success" />}
              {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground tabular-nums">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Safety Score */}
        <div
          className="rounded-2xl border border-border/60 bg-card p-6 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <h3 className="text-[13px] font-medium text-muted-foreground">Safety Score</h3>
          <div className="mt-6 flex flex-col items-center gap-6">
            <SafetyScoreRing score={72} />
            <div className="w-full">
              <SafetyScoreBreakdown factors={SCORE_FACTORS} />
            </div>
          </div>
          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/70">
            Based on real-time data within 100m of your location.
          </p>
        </div>

        {/* Map + sub-cards */}
        <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-8">
          <div
            className="rounded-2xl border border-border/60 bg-card p-5 animate-fade-in-up"
            style={{ animationDelay: "380ms" }}
          >
            <h3 className="mb-4 text-[13px] font-medium text-muted-foreground">
              Live Safety Map
            </h3>
            <SafetyMap />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: "460ms" }}>
              <PastActivities />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "540ms" }}>
              <RiskPredictionChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
