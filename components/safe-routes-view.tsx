"use client"

import { useState, useEffect, useRef } from "react"
import {
  Navigation,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  ChevronRight,
  Footprints,
  Lightbulb,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const ROUTES = [
  {
    id: 1,
    name: "Via Main Street",
    distance: "0.8 km",
    duration: "12 min",
    safety: "high",
    safetyScore: 89,
    features: ["Well-lit", "CCTV", "Commercial area"],
    recommended: true,
    color: "hsl(174, 60%, 45%)",
    points: [
      { x: 50, y: 85 },
      { x: 50, y: 60 },
      { x: 55, y: 45 },
      { x: 60, y: 35 },
      { x: 65, y: 25 },
      { x: 70, y: 15 },
    ],
  },
  {
    id: 2,
    name: "Via Oak Park",
    distance: "0.6 km",
    duration: "9 min",
    safety: "medium",
    safetyScore: 64,
    features: ["Shorter", "Park area", "Some dark spots"],
    recommended: false,
    color: "hsl(45, 90%, 55%)",
    points: [
      { x: 50, y: 85 },
      { x: 45, y: 70 },
      { x: 38, y: 55 },
      { x: 35, y: 40 },
      { x: 40, y: 28 },
      { x: 70, y: 15 },
    ],
  },
  {
    id: 3,
    name: "Via Elm Street",
    distance: "1.1 km",
    duration: "15 min",
    safety: "low",
    safetyScore: 38,
    features: ["Longest", "Recent incidents", "Poor lighting"],
    recommended: false,
    color: "hsl(0, 72%, 55%)",
    points: [
      { x: 50, y: 85 },
      { x: 60, y: 75 },
      { x: 72, y: 60 },
      { x: 78, y: 48 },
      { x: 80, y: 32 },
      { x: 70, y: 15 },
    ],
  },
]

function getSafetyBadge(safety: string) {
  switch (safety) {
    case "high":
      return "border-success/30 bg-success/10 text-success"
    case "medium":
      return "border-warning/30 bg-warning/10 text-warning"
    default:
      return "border-destructive/30 bg-destructive/10 text-destructive"
  }
}

function getFeatureIcon(feature: string) {
  if (feature.includes("lit") || feature.includes("Lighting")) return Lightbulb
  if (feature.includes("CCTV") || feature.includes("Camera")) return Camera
  if (feature.includes("Commercial") || feature.includes("Shorter")) return Footprints
  return Shield
}

export function SafeRoutesView() {
  const [selectedRoute, setSelectedRoute] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDims({ w: entry.contentRect.width, h: entry.contentRect.height })
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dims.w === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dims.w * 2
    canvas.height = dims.h * 2
    ctx.scale(2, 2)

    // Background
    ctx.fillStyle = "hsl(220, 18%, 8%)"
    ctx.fillRect(0, 0, dims.w, dims.h)

    // Grid
    ctx.strokeStyle = "hsl(220, 15%, 14%)"
    ctx.lineWidth = 1
    for (let x = 0; x < dims.w; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, dims.h)
      ctx.stroke()
    }
    for (let y = 0; y < dims.h; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(dims.w, y)
      ctx.stroke()
    }

    // Major roads
    ctx.strokeStyle = "hsl(220, 15%, 18%)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, dims.h * 0.4)
    ctx.lineTo(dims.w, dims.h * 0.4)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(dims.w * 0.5, 0)
    ctx.lineTo(dims.w * 0.5, dims.h)
    ctx.stroke()

    // Draw routes
    for (const route of ROUTES) {
      const isSelected = route.id === selectedRoute
      ctx.strokeStyle = route.color
      ctx.lineWidth = isSelected ? 4 : 2
      ctx.globalAlpha = isSelected ? 1 : 0.3
      ctx.setLineDash(isSelected ? [] : [6, 4])
      ctx.beginPath()
      route.points.forEach((pt, i) => {
        const px = (pt.x / 100) * dims.w
        const py = (pt.y / 100) * dims.h
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    // Start marker
    const startX = (50 / 100) * dims.w
    const startY = (85 / 100) * dims.h
    ctx.fillStyle = "hsl(174, 60%, 45%)"
    ctx.beginPath()
    ctx.arc(startX, startY, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "hsl(174, 60%, 60%)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(startX, startY, 11, 0, Math.PI * 2)
    ctx.stroke()

    // End marker
    const endX = (70 / 100) * dims.w
    const endY = (15 / 100) * dims.h
    ctx.fillStyle = "hsl(0, 72%, 55%)"
    ctx.beginPath()
    ctx.arc(endX, endY, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "hsl(0, 0%, 100%)"
    ctx.font = "bold 8px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("B", endX, endY)
  }, [dims, selectedRoute])

  const activeRoute = ROUTES.find((r) => r.id === selectedRoute)

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Input */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="route-from" className="mb-1 block text-xs text-muted-foreground">
                From
              </label>
              <Input
                id="route-from"
                defaultValue="Current Location"
                className="border-border bg-secondary text-foreground"
              />
            </div>
            <div className="flex items-end">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <label htmlFor="route-to" className="mb-1 block text-xs text-muted-foreground">
                To
              </label>
              <Input
                id="route-to"
                defaultValue="Central Station"
                className="border-border bg-secondary text-foreground"
              />
            </div>
            <Button className="self-end bg-primary text-primary-foreground hover:bg-primary/90">
              <Navigation className="mr-1.5 h-4 w-4" />
              Find Route
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div
            ref={containerRef}
            className="relative h-80 overflow-hidden rounded-xl border border-border bg-card lg:h-[500px]"
          >
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

            {/* Labels */}
            <div
              className="absolute z-10 flex items-center gap-1 rounded-md bg-primary/20 px-2 py-1"
              style={{ left: "44%", bottom: "10%" }}
            >
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-medium text-primary">You</span>
            </div>
            <div
              className="absolute z-10 flex items-center gap-1 rounded-md bg-destructive/20 px-2 py-1"
              style={{ left: "72%", top: "10%" }}
            >
              <MapPin className="h-3 w-3 text-destructive" />
              <span className="text-[10px] font-medium text-destructive">Station</span>
            </div>
          </div>
        </div>

        {/* Route Options */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Available Routes</h3>
          {ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                selectedRoute === route.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card hover:border-border hover:bg-secondary/50"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{route.name}</h4>
                    {route.recommended && (
                      <Badge className="bg-primary/15 text-[10px] text-primary">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Footprints className="h-3 w-3" />
                      {route.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.duration}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-xs", getSafetyBadge(route.safety))}
                >
                  {route.safetyScore}
                </Badge>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {route.features.map((f) => {
                  const Icon = getFeatureIcon(f)
                  return (
                    <span
                      key={f}
                      className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      <Icon className="h-2.5 w-2.5" />
                      {f}
                    </span>
                  )
                })}
              </div>

              {/* Safety bar */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    route.safety === "high"
                      ? "bg-success"
                      : route.safety === "medium"
                        ? "bg-warning"
                        : "bg-destructive"
                  )}
                  style={{ width: `${route.safetyScore}%` }}
                />
              </div>
            </button>
          ))}

          {activeRoute?.recommended && (
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                This route prioritizes safety over distance. It passes through well-lit commercial areas with CCTV coverage and avoids recent incident zones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
