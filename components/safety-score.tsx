"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function getScoreColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Safe";
  if (score >= 50) return "Moderate";
  return "High Risk";
}

export function SafetyScoreRing({
  score,
  size = 180,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const colorClass = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Value Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(
            "transition-all duration-1000 ease-out stroke-current",
            colorClass,
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-4xl font-bold tabular-nums", colorClass)}>
          {animatedScore}
        </span>
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            colorClass,
          )}
        >
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

export function SafetyScoreBreakdown({
  factors,
}: {
  factors: { label: string; value: number; max: number }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {factors.map((f) => {
        const pct = (f.value / f.max) * 100;
        const color =
          pct >= 75
            ? "bg-success"
            : pct >= 50
              ? "bg-warning"
              : "bg-destructive";
        return (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{f.label}</span>
              <span className="font-medium text-foreground tabular-nums">
                {f.value}/{f.max}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  color,
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
