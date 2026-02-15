"use client";

import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HOURS = [
  { hour: "6AM", risk: 15 },
  { hour: "8AM", risk: 25 },
  { hour: "10AM", risk: 12 },
  { hour: "12PM", risk: 18 },
  { hour: "2PM", risk: 14 },
  { hour: "4PM", risk: 22 },
  { hour: "6PM", risk: 35 },
  { hour: "8PM", risk: 55 },
  { hour: "10PM", risk: 72 },
  { hour: "12AM", risk: 68 },
  { hour: "2AM", risk: 45 },
  { hour: "4AM", risk: 30 },
];

function getBarColor(risk: number) {
  if (risk >= 60) return "bg-destructive";
  if (risk >= 35) return "bg-warning";
  return "bg-primary";
}

import { cn } from "@/lib/utils";

export function RiskPredictionChart({ className }: { className?: string }) {
  const maxRisk = Math.max(...HOURS.map((h) => h.risk));

  return (
    <Card className={cn("border-border bg-card flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Risk Prediction
          </CardTitle>
          <Badge
            variant="outline"
            className="border-border text-xs text-muted-foreground"
          >
            ML Model
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-1 flex flex-col">
        <div className="flex justify-between gap-1 flex-1 min-h-[200px]">
          {HOURS.map((h) => {
            const heightPct = (h.risk / maxRisk) * 100;
            return (
              <div
                key={h.hour}
                className="group flex flex-1 flex-col items-center gap-1"
              >
                <div className="relative w-full flex-1 flex items-end justify-center">
                  <div
                    className={`w-full rounded-t transition-all ${getBarColor(h.risk)} group-hover:opacity-80`}
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                  />
                  <div className="absolute bottom-full mb-1 w-full text-center hidden group-hover:block">
                    <span className="text-[10px] font-medium text-foreground">
                      {h.risk}%
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {h.hour}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 shrink-0">
          <p className="text-[10px] text-muted-foreground">
            Peak risk: 10PM - 12AM
          </p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Low
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Med
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> High
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
