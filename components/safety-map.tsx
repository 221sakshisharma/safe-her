"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertTriangle, Building, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const INCIDENT_DATA = [
  { id: 1, x: 25, y: 35, type: "theft", severity: "medium", time: "2h ago" },
  { id: 2, x: 60, y: 20, type: "harassment", severity: "high", time: "5h ago" },
  { id: 3, x: 45, y: 65, type: "suspicious", severity: "low", time: "1d ago" },
  { id: 4, x: 75, y: 45, type: "assault", severity: "high", time: "3h ago" },
  { id: 5, x: 35, y: 80, type: "theft", severity: "medium", time: "6h ago" },
  { id: 6, x: 80, y: 70, type: "vandalism", severity: "low", time: "2d ago" },
  { id: 7, x: 15, y: 55, type: "harassment", severity: "medium", time: "8h ago" },
]

const SAFE_PLACES = [
  { id: 1, x: 40, y: 40, name: "Police Station", icon: Building },
  { id: 2, x: 70, y: 30, name: "Hospital", icon: Building },
  { id: 3, x: 20, y: 70, name: "Fire Station", icon: Phone },
]

function getSeverityColor(severity: string) {
  switch (severity) {
    case "high":
      return "bg-destructive"
    case "medium":
      return "bg-warning"
    default:
      return "bg-muted-foreground"
  }
}

function getSeverityGlow(severity: string) {
  switch (severity) {
    case "high":
      return "shadow-[0_0_12px_hsl(0,72%,55%,0.5)]"
    case "medium":
      return "shadow-[0_0_10px_hsl(45,90%,55%,0.4)]"
    default:
      return ""
  }
}

export function SafetyMap({ fullscreen = false }: { fullscreen?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIncident, setHoveredIncident] = useState<number | null>(null)
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        })
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.w === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.w * 2
    canvas.height = dimensions.h * 2
    ctx.scale(2, 2)

    // Dark map background
    ctx.fillStyle = "hsl(220, 18%, 8%)"
    ctx.fillRect(0, 0, dimensions.w, dimensions.h)

    // Grid lines simulating streets
    ctx.strokeStyle = "hsl(220, 15%, 14%)"
    ctx.lineWidth = 1
    const gridSpacing = 40
    for (let x = 0; x < dimensions.w; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, dimensions.h)
      ctx.stroke()
    }
    for (let y = 0; y < dimensions.h; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(dimensions.w, y)
      ctx.stroke()
    }

    // Major roads
    ctx.strokeStyle = "hsl(220, 15%, 18%)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, dimensions.h * 0.4)
    ctx.lineTo(dimensions.w, dimensions.h * 0.4)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(dimensions.w * 0.5, 0)
    ctx.lineTo(dimensions.w * 0.5, dimensions.h)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, dimensions.h * 0.7)
    ctx.quadraticCurveTo(dimensions.w * 0.3, dimensions.h * 0.6, dimensions.w, dimensions.h * 0.8)
    ctx.stroke()

    // Heatmap zones
    const zones = [
      { cx: dimensions.w * 0.6, cy: dimensions.h * 0.22, r: 60, color: "hsla(0, 72%, 55%, 0.12)" },
      { cx: dimensions.w * 0.75, cy: dimensions.h * 0.45, r: 50, color: "hsla(0, 72%, 55%, 0.15)" },
      { cx: dimensions.w * 0.25, cy: dimensions.h * 0.35, r: 45, color: "hsla(45, 90%, 55%, 0.1)" },
      { cx: dimensions.w * 0.4, cy: dimensions.h * 0.65, r: 35, color: "hsla(140, 50%, 45%, 0.08)" },
    ]
    for (const zone of zones) {
      const gradient = ctx.createRadialGradient(zone.cx, zone.cy, 0, zone.cx, zone.cy, zone.r)
      gradient.addColorStop(0, zone.color)
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.fillRect(zone.cx - zone.r, zone.cy - zone.r, zone.r * 2, zone.r * 2)
    }

    // User location pulse
    const userX = dimensions.w * 0.5
    const userY = dimensions.h * 0.5
    const pulse = ctx.createRadialGradient(userX, userY, 0, userX, userY, 30)
    pulse.addColorStop(0, "hsla(174, 60%, 45%, 0.25)")
    pulse.addColorStop(1, "transparent")
    ctx.fillStyle = pulse
    ctx.beginPath()
    ctx.arc(userX, userY, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "hsl(174, 60%, 45%)"
    ctx.beginPath()
    ctx.arc(userX, userY, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "hsl(174, 60%, 60%)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(userX, userY, 10, 0, Math.PI * 2)
    ctx.stroke()
  }, [dimensions])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        fullscreen ? "h-full" : "h-64 lg:h-80"
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Incident markers */}
      {INCIDENT_DATA.map((incident) => (
        <button
          key={incident.id}
          className={cn(
            "absolute z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-transform hover:scale-150",
            getSeverityColor(incident.severity),
            getSeverityGlow(incident.severity)
          )}
          style={{
            left: `${incident.x}%`,
            top: `${incident.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setHoveredIncident(incident.id)}
          onMouseLeave={() => setHoveredIncident(null)}
          aria-label={`${incident.type} incident, ${incident.severity} severity, ${incident.time}`}
        >
          {hoveredIncident === incident.id && (
            <div className="absolute bottom-full mb-2 whitespace-nowrap rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg">
              <p className="font-medium capitalize">{incident.type}</p>
              <p className="text-muted-foreground">{incident.time}</p>
            </div>
          )}
        </button>
      ))}

      {/* Safe places */}
      {SAFE_PLACES.map((place) => (
        <div
          key={place.id}
          className="absolute z-10 flex h-5 w-5 items-center justify-center rounded-md bg-primary/20"
          style={{
            left: `${place.x}%`,
            top: `${place.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          title={place.name}
        >
          <place.icon className="h-3 w-3 text-primary" />
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 rounded-lg bg-card/90 px-3 py-2 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-destructive" /> High
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-warning" /> Medium
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Low
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-primary">
          <MapPin className="h-2.5 w-2.5" /> You
        </span>
      </div>

      {/* Radius indicator */}
      <div className="absolute right-3 top-3 z-10 rounded-md bg-card/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
        100m radius
      </div>
    </div>
  )
}
