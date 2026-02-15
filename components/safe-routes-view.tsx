"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Navigation,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Footprints,
  Lightbulb,
  Camera,
  Loader2,
  LocateFixed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGeolocation } from "@/hooks/use-geolocation"

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

function generateRoutes(startLat: number, startLng: number) {
  const destLat = startLat + 0.012
  const destLng = startLng + 0.008

  return {
    destination: { lat: destLat, lng: destLng },
    routes: [
      {
        id: 1,
        name: "Via Main Street",
        distance: "0.8 km",
        duration: "12 min",
        safety: "high",
        safetyScore: 89,
        features: ["Well-lit", "CCTV", "Commercial area"],
        recommended: true,
        color: "#2ba870",
        points: [
          [startLat, startLng],
          [startLat + 0.003, startLng + 0.001],
          [startLat + 0.006, startLng + 0.003],
          [startLat + 0.009, startLng + 0.005],
          [destLat, destLng],
        ] as [number, number][],
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
        color: "#d4a017",
        points: [
          [startLat, startLng],
          [startLat + 0.002, startLng - 0.002],
          [startLat + 0.005, startLng + 0.001],
          [startLat + 0.008, startLng + 0.005],
          [destLat, destLng],
        ] as [number, number][],
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
        color: "#d95050",
        points: [
          [startLat, startLng],
          [startLat + 0.001, startLng + 0.005],
          [startLat + 0.004, startLng + 0.009],
          [startLat + 0.008, startLng + 0.011],
          [startLat + 0.011, startLng + 0.009],
          [destLat, destLng],
        ] as [number, number][],
      },
    ],
  }
}

function getSafetyBadge(safety: string) {
  switch (safety) {
    case "high":
      return "border-success/20 bg-success/10 text-success"
    case "medium":
      return "border-warning/20 bg-warning/10 text-warning"
    default:
      return "border-destructive/20 bg-destructive/10 text-destructive"
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
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const { lat, lng, loading, hasLocation, error } = useGeolocation()
  const layersRef = useRef<L.Layer[]>([])

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

  const routeData = generateRoutes(lat, lng)

  const drawRoutes = useCallback(() => {
    if (!mapRef.current || !leafletLoaded) return
    const L = window.L
    const map = mapRef.current

    layersRef.current.forEach((layer) => map.removeLayer(layer))
    layersRef.current = []

    const currentRouteData = generateRoutes(lat, lng)

    currentRouteData.routes.forEach((route) => {
      const isSelected = route.id === selectedRoute
      const polyline = L.polyline(route.points, {
        color: route.color,
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.25,
        dashArray: isSelected ? undefined : "8 6",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map)
      layersRef.current.push(polyline)
    })

    const startIcon = L.divIcon({
      className: "custom-start-marker",
      html: `
        <div style="position:relative;width:32px;height:32px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(130,120,220,0.12);animation:pulse-ring 2s ease-out infinite;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#8278dc;border:2px solid #b4aef0;box-shadow:0 0 12px rgba(130,120,220,0.4);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
    const startMarker = L.marker([lat, lng], { icon: startIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui,sans-serif;font-size:12px;color:#dcdce4;background:rgba(16,16,23,0.9);padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(8px);">
          <strong style="color:#8278dc;">Your Location</strong>
        </div>`,
        { className: "dark-popup" }
      )
    layersRef.current.push(startMarker)

    const destIcon = L.divIcon({
      className: "custom-dest-marker",
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#d95050;border:3px solid #fca5a5;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(217,80,80,0.4);">
        <span style="color:white;font-size:8px;font-weight:bold;">B</span>
      </div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    const destMarker = L.marker(
      [currentRouteData.destination.lat, currentRouteData.destination.lng],
      { icon: destIcon }
    )
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui,sans-serif;font-size:12px;color:#dcdce4;background:rgba(16,16,23,0.9);padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(8px);">
          <strong style="color:#d95050;">Destination</strong>
        </div>`,
        { className: "dark-popup" }
      )
    layersRef.current.push(destMarker)

    const selectedRouteData = currentRouteData.routes.find((r) => r.id === selectedRoute)
    if (selectedRouteData) {
      const bounds = L.latLngBounds(selectedRouteData.points)
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [lat, lng, selectedRoute, leafletLoaded])

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || loading) return
    const L = window.L

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 14)

      const isDark = document.documentElement.classList.contains("dark")
      L.tileLayer(
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map)

      L.control.zoom({ position: "topright" }).addTo(map)

      mapRef.current = map

      if (!document.getElementById("route-map-css")) {
        const style = document.createElement("style")
        style.id = "route-map-css"
        style.textContent = `
          @keyframes pulse-ring {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          .dark-popup .leaflet-popup-content-wrapper {
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .dark-popup .leaflet-popup-content { margin: 0 !important; }
          .dark-popup .leaflet-popup-tip { background: #1f2937 !important; }
          .leaflet-control-zoom a {
            background: rgba(16,16,23,0.85) !important;
            color: #dcdce4 !important;
            border-color: rgba(255,255,255,0.06) !important;
            border-radius: 8px !important;
            backdrop-filter: blur(8px);
          }
          .leaflet-control-zoom a:hover { background: rgba(24,24,34,0.95) !important; }
          .leaflet-control-zoom { border-radius: 10px !important; overflow: hidden; border: none !important; }
        `
        document.head.appendChild(style)
      }
    }

    drawRoutes()
  }, [leafletLoaded, lat, lng, loading, drawRoutes])

  useEffect(() => {
    drawRoutes()
  }, [selectedRoute, drawRoutes])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const activeRoute = routeData.routes.find((r) => r.id === selectedRoute)

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Input */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 animate-fade-in-up">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="route-from" className="mb-1 block text-[11px] font-medium text-muted-foreground">
              From
            </label>
            <div className="relative">
              <Input
                id="route-from"
                defaultValue={hasLocation ? "Current Location (GPS)" : "Current Location"}
                className="rounded-xl border-border bg-accent text-foreground pr-8"
                readOnly
              />
              {hasLocation && (
                <LocateFixed className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
              )}
            </div>
          </div>
          <div className="flex items-end pb-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <label htmlFor="route-to" className="mb-1 block text-[11px] font-medium text-muted-foreground">
              To
            </label>
            <Input
              id="route-to"
              defaultValue="Central Station"
              className="rounded-xl border-border bg-accent text-foreground"
            />
          </div>
          <Button className="self-end rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Navigation className="mr-1.5 h-4 w-4" />
            Find Route
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-[11px] text-warning">
            Using approximate location. Enable GPS for better accuracy.
          </p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
        {/* Map */}
        <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="relative h-80 overflow-hidden rounded-2xl border border-border/60 bg-card lg:h-[500px]">
            {loading || !leafletLoaded ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-[11px] text-muted-foreground">
                    {loading ? "Getting your location..." : "Loading map..."}
                  </p>
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="absolute inset-0 z-0" />
            )}

            {!loading && leafletLoaded && (
              <>
                <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 backdrop-blur-sm">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">You</span>
                </div>
                <div className="absolute right-14 top-3 z-[1000] flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1 backdrop-blur-sm">
                  <MapPin className="h-3 w-3 text-destructive" />
                  <span className="text-[10px] font-medium text-destructive">Destination</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Route Options */}
        <div className="flex flex-col gap-3 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-semibold text-foreground">Available Routes</h3>
          {routeData.routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200",
                selectedRoute === route.id
                  ? "border-primary/20 bg-primary/5"
                  : "border-border/60 bg-card hover:border-border"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <h4 className="text-[13px] font-semibold text-foreground">
                      {route.name}
                    </h4>
                    {route.recommended && (
                      <Badge className="rounded-full bg-primary/10 text-[10px] text-primary border-0">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
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
                  className={cn("rounded-full text-[11px]", getSafetyBadge(route.safety))}
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
                      className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      <Icon className="h-2.5 w-2.5" />
                      {f}
                    </span>
                  )
                })}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
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
            <div className="flex items-start gap-2.5 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                This route prioritizes safety over distance. It passes through well-lit commercial areas with CCTV coverage and avoids recent incident zones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
