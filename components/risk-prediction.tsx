"use client"

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
]

function getBarColor(risk: number) {
  if (risk >= 60) return "bg-destructive/70"
  if (risk >= 35) return "bg-warning/70"
  return "bg-primary/40"
}

export function RiskPredictionChart() {
  const maxRisk = Math.max(...HOURS.map((h) => h.risk))

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[13px] font-medium text-muted-foreground">Risk Prediction</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          ML Model
        </span>
      </div>
      <div className="flex items-end justify-between gap-[3px]" style={{ height: 110 }}>
        {HOURS.map((h) => {
          const heightPct = (h.risk / maxRisk) * 100
          return (
            <div key={h.hour} className="group flex flex-1 flex-col items-center gap-1.5">
              <div className="relative w-full" style={{ height: 90 }}>
                <div
                  className={`absolute bottom-0 w-full rounded-sm transition-all duration-300 ${getBarColor(h.risk)} group-hover:opacity-100 opacity-80`}
                  style={{ height: `${heightPct}%`, minHeight: 3 }}
                />
                <div className="absolute bottom-full mb-1 hidden w-full text-center group-hover:block">
                  <span className="text-[9px] font-medium text-foreground">{h.risk}%</span>
                </div>
              </div>
              <span className="text-[8px] text-muted-foreground/60">{h.hour}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
        <p className="text-[10px] text-muted-foreground/70">Peak: 10PM - 12AM</p>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" /> Low
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-warning/70" /> Med
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/70" /> High
          </span>
        </div>
      </div>
    </div>
  )
}
