"use client";

import {
  Clock,
  TrendingDown,
  TrendingUp,
  Eye,
  ShieldAlert,
  Activity,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SafetyScoreRing,
  SafetyScoreBreakdown,
} from "@/components/safety-score";
import { RiskPredictionChart } from "@/components/risk-prediction";
import { useSafety } from "@/context/safety-context";

const SCORE_FACTORS = [
  { label: "Incident Frequency", value: 22, max: 30 },
  { label: "Severity Index", value: 18, max: 25 },
  { label: "Recency Factor", value: 12, max: 20 },
  { label: "Lighting & Infrastructure", value: 15, max: 15 },
  { label: "Community Reports", value: 5, max: 10 },
];

export function DashboardView() {
  const { safetyScore, riskLevel, incidents, locationName, loading } =
    useSafety();

  const stats = [
    {
      label: "Recent Incidents",
      value: loading ? "..." : incidents.length.toString(),
      trend: incidents.length > 5 ? "up" : "down",
      icon: ShieldAlert,
      color: incidents.length > 5 ? "text-destructive" : "text-success",
    },
    {
      label: "Risk Level",
      value: loading ? "..." : riskLevel,
      trend: riskLevel === "Low" ? "down" : "up",
      icon: Activity,
      color:
        riskLevel === "Low"
          ? "text-success"
          : riskLevel === "Moderate"
            ? "text-warning"
            : "text-destructive",
    },
    {
      label: "Current Location",
      value: loading ? "Locating..." : locationName,
      trend: null,
      icon: MapPin,
      color: "text-primary",
    },
    {
      label: "Last Updated",
      value: "Just now",
      trend: null,
      icon: Clock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-lg font-bold text-foreground truncate ${stat.label === "Current Location" ? "text-sm" : ""}`}
                  >
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Safety Score */}
        <Card className="border-border bg-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Safety Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pb-6">
            <SafetyScoreRing score={loading ? 0 : safetyScore} />
            <div className="w-full">
              <SafetyScoreBreakdown factors={SCORE_FACTORS} />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Score based on real-time news analysis for {locationName}.
            </p>
          </CardContent>
        </Card>

        {/* Risk Prediction Chart (Previously Map + Activities) */}
        <RiskPredictionChart className="lg:col-span-2 h-full" />
      </div>
    </div>
  );
}
