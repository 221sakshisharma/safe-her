"use client"

import { useState, useEffect, useRef } from "react"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Users,
  Shield,
  X,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
  Navigation,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGeolocation } from "@/hooks/use-geolocation"

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

const TRUSTED_CIRCLE = [
  { id: 1, name: "Mom", phone: "+1 555-0101", status: "online", initials: "M" },
  { id: 2, name: "Priya S.", phone: "+1 555-0102", status: "online", initials: "PS" },
  { id: 3, name: "David K.", phone: "+1 555-0103", status: "offline", initials: "DK" },
  { id: 4, name: "SafeHer Support", phone: "911", status: "online", initials: "SH" },
]

const NEARBY_HELP = [
  { name: "Central Police Station", distance: "0.3 km", type: "Police" },
  { name: "City Hospital ER", distance: "0.8 km", type: "Hospital" },
  { name: "Fire Station #5", distance: "1.2 km", type: "Fire" },
]

function SOSMiniMap({ lat, lng, active }: { lat: number; lng: number; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true)
      return
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => setLeafletLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!leafletLoaded || !containerRef.current) return
    const L = window.L

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16)
      return
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([lat, lng], 16)

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map)

    const pulseColor = active ? "rgba(239,68,68" : "rgba(219,83,117"
    const solidColor = active ? "#ef4444" : "#db5375"
    const borderColor = active ? "#fca5a5" : "#f9b4c6"

    const userIcon = L.divIcon({
      className: "sos-user-marker",
      html: `
        <div style="position:relative;width:48px;height:48px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:${pulseColor},0.12);animation:sos-pulse 1.5s ease-out infinite;"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;background:${pulseColor},0.2);animation:sos-pulse 1.5s ease-out infinite 0.3s;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:${solidColor};border:3px solid ${borderColor};box-shadow:0 0 16px ${pulseColor},0.5);"></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    })

    L.marker([lat, lng], { icon: userIcon }).addTo(map)

    L.circle([lat, lng], {
      radius: active ? 200 : 100,
      color: active ? "rgba(239,68,68,0.3)" : "rgba(219,83,117,0.25)",
      fillColor: active ? "rgba(239,68,68,0.06)" : "rgba(219,83,117,0.04)",
      fillOpacity: 1,
      weight: 1,
    }).addTo(map)

    if (!document.getElementById("sos-pulse-css")) {
      const style = document.createElement("style")
      style.id = "sos-pulse-css"
      style.textContent = `
        @keyframes sos-pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    mapRef.current = map
  }, [leafletLoaded, lat, lng, active])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  if (!leafletLoaded) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-muted/30">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-border">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute bottom-2.5 left-2.5 z-[1000] rounded-lg bg-card/90 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>
      {active && (
        <div className="absolute right-2.5 top-2.5 z-[1000] flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
          <span className="text-[10px] font-medium text-destructive">Broadcasting</span>
        </div>
      )}
    </div>
  )
}

export function SOSView() {
  const [activated, setActivated] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const { lat, lng, hasLocation, error, loading } = useGeolocation()

  function handleSOS() {
    if (activated) {
      setActivated(false)
      setCountdown(null)
      return
    }
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          setActivated(true)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* SOS Button Section */}
      <div
        className={cn(
          "rounded-2xl border bg-card p-6 transition-all duration-300 animate-fade-in",
          activated ? "border-destructive/30 bg-destructive/5" : "border-border"
        )}
      >
        <div className="flex flex-col items-center gap-6">
          {activated && (
            <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 animate-scale-in">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-sm font-semibold text-destructive">
                ALERT ACTIVE - Contacts Notified
              </span>
            </div>
          )}

          <div className="relative">
            {(activated || countdown !== null) && (
              <>
                <span className="absolute inset-0 rounded-full bg-destructive/15 animate-pulse-ring" />
                <span
                  className="absolute inset-0 rounded-full bg-destructive/8 animate-pulse-ring"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
            <button
              onClick={handleSOS}
              className={cn(
                "relative flex h-36 w-36 flex-col items-center justify-center rounded-full transition-all duration-300",
                activated
                  ? "bg-destructive shadow-[0_0_40px_hsl(0,68%,56%,0.35)]"
                  : countdown !== null
                    ? "bg-destructive/80 shadow-[0_0_30px_hsl(0,68%,56%,0.25)]"
                    : "bg-destructive/90 hover:bg-destructive hover:shadow-[0_0_30px_hsl(0,68%,56%,0.25)]"
              )}
              aria-label={activated ? "Cancel SOS alert" : "Activate SOS alert"}
            >
              {countdown !== null ? (
                <span className="text-5xl font-semibold text-destructive-foreground">
                  {countdown}
                </span>
              ) : activated ? (
                <>
                  <X className="h-10 w-10 text-destructive-foreground" />
                  <span className="mt-1 text-xs font-semibold text-destructive-foreground">
                    CANCEL
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-10 w-10 text-destructive-foreground" />
                  <span className="mt-1 text-sm font-bold text-destructive-foreground">
                    SOS
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="max-w-sm text-center text-[13px] leading-relaxed text-muted-foreground">
            {activated
              ? "Your live location is being shared with your trusted circle. Emergency services have been notified."
              : "Tap to send an emergency alert to your trusted circle with your live location."}
          </p>

          {activated && (
            <div className="flex gap-3 animate-fade-in">
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Phone className="h-3.5 w-3.5" />
                Call 911
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl border-border bg-transparent text-foreground"
              >
                <Send className="h-3.5 w-3.5" />
                Share Location
              </Button>
            </div>
          )}

          <div className="w-full max-w-md">
            <SOSMiniMap lat={lat} lng={lng} active={activated} />
            <div className="mt-2 flex items-center justify-center gap-2">
              <Navigation className="h-3 w-3 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                {loading
                  ? "Getting location..."
                  : hasLocation
                    ? `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
                    : `Approximate: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              </span>
              {error && (
                <span className="text-[10px] text-warning">(GPS unavailable)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {/* Trusted Circle */}
        <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Trusted Circle</h3>
          </div>
          <div className="flex flex-col gap-2">
            {TRUSTED_CIRCLE.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 rounded-xl bg-accent/50 px-3.5 py-2.5 transition-colors hover:bg-accent"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {person.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{person.name}</p>
                  <p className="text-[11px] text-muted-foreground">{person.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      person.status === "online"
                        ? "bg-success"
                        : "bg-muted-foreground/40"
                    )}
                  />
                  {activated && person.status === "online" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full rounded-xl border-border bg-transparent text-muted-foreground"
            size="sm"
          >
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Add to Circle
          </Button>
        </div>

        {/* Nearby Help Centers */}
        <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Nearby Help Centers</h3>
          </div>
          <div className="flex flex-col gap-2">
            {NEARBY_HELP.map((place) => (
              <div
                key={place.name}
                className="flex items-center gap-3 rounded-xl bg-accent/50 px-3.5 py-2.5 transition-colors hover:bg-accent"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {place.type === "Police" ? (
                    <Shield className="h-4 w-4 text-primary" />
                  ) : place.type === "Hospital" ? (
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  ) : (
                    <Phone className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{place.name}</p>
                  <p className="text-[11px] text-muted-foreground">{place.distance}</p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-border text-[10px] text-muted-foreground"
                >
                  {place.type}
                </Badge>
              </div>
            ))}
          </div>

          {activated && hasLocation && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3.5 py-2.5">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-[11px] text-primary">
                Live GPS location shared with emergency contacts. Nearest help: 0.3 km away.
              </p>
            </div>
          )}
          {activated && !hasLocation && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-warning/15 bg-warning/5 px-3.5 py-2.5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-[11px] text-warning">
                Sharing approximate location. Enable GPS for precise tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
