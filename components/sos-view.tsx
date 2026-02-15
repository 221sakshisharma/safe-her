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
    if (window.L) { setLeafletLoaded(true); return }
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
    if (mapRef.current) { mapRef.current.setView([lat, lng], 16); return }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([lat, lng], 16)

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map)

    const pulseColor = active ? "rgba(199,80,80" : "rgba(130,120,220"
    const solidColor = active ? "#c75050" : "#8278dc"
    const borderColor = active ? "#e8a0a0" : "#b4aef0"

    const userIcon = L.divIcon({
      className: "sos-user-marker",
      html: `<div style="position:relative;width:40px;height:40px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${pulseColor},0.12);animation:sos-pulse 1.5s ease-out infinite;"></div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:${solidColor};border:2px solid ${borderColor};box-shadow:0 0 16px ${pulseColor},0.4);"></div>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
    L.marker([lat, lng], { icon: userIcon }).addTo(map)

    L.circle([lat, lng], {
      radius: active ? 200 : 100,
      color: active ? "rgba(199,80,80,0.2)" : "rgba(130,120,220,0.2)",
      fillColor: active ? "rgba(199,80,80,0.05)" : "rgba(130,120,220,0.04)",
      fillOpacity: 1, weight: 1,
    }).addTo(map)

    if (!document.getElementById("sos-pulse-css")) {
      const style = document.createElement("style")
      style.id = "sos-pulse-css"
      style.textContent = `@keyframes sos-pulse { 0% { transform:scale(0.5);opacity:1; } 100% { transform:scale(1.8);opacity:0; } }`
      document.head.appendChild(style)
    }
    mapRef.current = map
  }, [leafletLoaded, lat, lng, active])

  useEffect(() => { return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } } }, [])

  if (!leafletLoaded) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl bg-muted/30">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-border/40">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute bottom-2 left-2 z-[1000] rounded-md bg-card/80 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>
      {active && (
        <div className="absolute right-2 top-2 z-[1000] flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-0.5 backdrop-blur-sm">
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
    if (activated) { setActivated(false); setCountdown(null); return }
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) { clearInterval(interval); setActivated(true); return null }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* SOS Button */}
      <div
        className={cn(
          "rounded-2xl border bg-card p-8 transition-all duration-300 animate-fade-in-up",
          activated ? "border-destructive/20" : "border-border/60"
        )}
      >
        <div className="flex flex-col items-center gap-6">
          {activated && (
            <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 animate-scale-in">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              <span className="text-[13px] font-medium text-destructive">
                Alert Active - Contacts Notified
              </span>
            </div>
          )}

          <div className="relative">
            {(activated || countdown !== null) && (
              <>
                <span className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-destructive/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
              </>
            )}
            <button
              onClick={handleSOS}
              className={cn(
                "relative flex h-32 w-32 flex-col items-center justify-center rounded-full transition-all duration-300",
                activated
                  ? "bg-destructive shadow-[0_0_60px_hsl(0,55%,55%,0.25)]"
                  : countdown !== null
                    ? "bg-destructive/80"
                    : "bg-destructive/80 hover:bg-destructive hover:shadow-[0_0_40px_hsl(0,55%,55%,0.2)]"
              )}
              aria-label={activated ? "Cancel SOS alert" : "Activate SOS alert"}
            >
              {countdown !== null ? (
                <span className="text-5xl font-light text-destructive-foreground">{countdown}</span>
              ) : activated ? (
                <>
                  <X className="h-8 w-8 text-destructive-foreground" />
                  <span className="mt-1 text-[10px] font-medium text-destructive-foreground/80">CANCEL</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 text-destructive-foreground" />
                  <span className="mt-1 text-[12px] font-semibold text-destructive-foreground">SOS</span>
                </>
              )}
            </button>
          </div>

          <p className="max-w-sm text-center text-[13px] leading-relaxed text-muted-foreground">
            {activated
              ? "Your live location is being shared. Emergency services notified."
              : "Tap to alert your trusted circle with your live location."}
          </p>

          {activated && (
            <div className="flex gap-3 animate-fade-in">
              <Button size="sm" className="gap-1.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <Phone className="h-3.5 w-3.5" /> Call 911
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 rounded-xl border-border/60 text-foreground bg-transparent">
                <Send className="h-3.5 w-3.5" /> Share Location
              </Button>
            </div>
          )}

          <div className="w-full max-w-md">
            <SOSMiniMap lat={lat} lng={lng} active={activated} />
            <div className="mt-2 flex items-center justify-center gap-2">
              <Navigation className="h-3 w-3 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                {loading ? "Getting location..." : hasLocation ? `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : `Approximate: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              </span>
              {error && <span className="text-[10px] text-warning">(GPS unavailable)</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {/* Trusted Circle */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h3 className="mb-4 text-[13px] font-medium text-muted-foreground">Trusted Circle</h3>
          <div className="flex flex-col gap-2">
            {TRUSTED_CIRCLE.map((person) => (
              <div key={person.id} className="flex items-center gap-3 rounded-xl bg-accent/40 px-3 py-2.5 transition-colors hover:bg-accent/70">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {person.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{person.name}</p>
                  <p className="text-[11px] text-muted-foreground/60">{person.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", person.status === "online" ? "bg-success" : "bg-muted-foreground/30")} />
                  {activated && person.status === "online" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3 w-full rounded-xl border-border/60 text-muted-foreground bg-transparent" size="sm">
            <Users className="mr-1.5 h-3.5 w-3.5" /> Add to Circle
          </Button>
        </div>

        {/* Nearby Help */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h3 className="mb-4 text-[13px] font-medium text-muted-foreground">Nearby Help Centers</h3>
          <div className="flex flex-col gap-2">
            {NEARBY_HELP.map((place) => (
              <div key={place.name} className="flex items-center gap-3 rounded-xl bg-accent/40 px-3 py-2.5 transition-colors hover:bg-accent/70">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {place.type === "Police" ? <Shield className="h-4 w-4 text-primary" /> : place.type === "Hospital" ? <AlertTriangle className="h-4 w-4 text-primary" /> : <Phone className="h-4 w-4 text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{place.name}</p>
                  <p className="text-[11px] text-muted-foreground/60">{place.distance}</p>
                </div>
                <Badge variant="outline" className="rounded-full border-border/40 text-[10px] text-muted-foreground">{place.type}</Badge>
              </div>
            ))}
          </div>

          {activated && hasLocation && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <p className="text-[11px] text-muted-foreground">Live GPS shared. Nearest help: 0.3 km.</p>
            </div>
          )}
          {activated && !hasLocation && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-warning/5 px-3 py-2.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              <p className="text-[11px] text-muted-foreground">Approximate location shared. Enable GPS for precision.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
