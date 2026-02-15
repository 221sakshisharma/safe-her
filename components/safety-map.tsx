"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, LocateFixed } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "high":
      return "#ef4444"
    case "medium":
      return "#eab308"
    default:
      return "#6b7280"
  }
}

function generateIncidents(lat: number, lng: number) {
  const incidents = [
    { type: "theft", severity: "medium", time: "2h ago", offsetLat: 0.003, offsetLng: -0.004 },
    { type: "harassment", severity: "high", time: "5h ago", offsetLat: -0.005, offsetLng: 0.006 },
    { type: "suspicious", severity: "low", time: "1d ago", offsetLat: 0.002, offsetLng: 0.003 },
    { type: "assault", severity: "high", time: "3h ago", offsetLat: -0.003, offsetLng: -0.005 },
    { type: "theft", severity: "medium", time: "6h ago", offsetLat: 0.006, offsetLng: -0.002 },
    { type: "vandalism", severity: "low", time: "2d ago", offsetLat: -0.004, offsetLng: 0.004 },
    { type: "harassment", severity: "medium", time: "8h ago", offsetLat: 0.004, offsetLng: 0.005 },
  ]
  return incidents.map((inc, i) => ({
    id: i + 1,
    lat: lat + inc.offsetLat,
    lng: lng + inc.offsetLng,
    type: inc.type,
    severity: inc.severity,
    time: inc.time,
  }))
}

function generateSafePlaces(lat: number, lng: number) {
  return [
    { id: 1, lat: lat + 0.002, lng: lng + 0.002, name: "Police Station", type: "police" },
    { id: 2, lat: lat - 0.003, lng: lng + 0.004, name: "Hospital", type: "hospital" },
    { id: 3, lat: lat + 0.004, lng: lng - 0.003, name: "Fire Station", type: "fire" },
  ]
}

export function SafetyMap({ fullscreen = false }: { fullscreen?: boolean }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const { lat, lng, loading, hasLocation, error } = useGeolocation()
  const markersRef = useRef<L.Layer[]>([])

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
    if (!leafletLoaded || !mapContainerRef.current || loading) return
    const L = window.L

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15)
    } else {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 15)

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map)

      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map)
      L.control.zoom({ position: "topright" }).addTo(map)
      mapRef.current = map
    }

    markersRef.current.forEach((m) => mapRef.current?.removeLayer(m))
    markersRef.current = []

    const map = mapRef.current!

    // User marker
    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="position:relative;width:40px;height:40px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(219,83,117,0.12);animation:pulse-ring 2s ease-out infinite;"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:rgba(219,83,117,0.2);animation:pulse-ring 2s ease-out infinite 0.5s;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#db5375;border:3px solid #f9b4c6;box-shadow:0 0 12px rgba(219,83,117,0.5);"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
    const userMarker = L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui,sans-serif;font-size:12px;color:#111827;background:#ffffff;padding:6px 10px;border-radius:10px;border:1px solid #e5e7eb;">
          <strong style="color:#db5375;">Your Location</strong><br/>
          <span style="color:#6b7280;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
        </div>`,
        { className: "map-popup" }
      )
    markersRef.current.push(userMarker)

    if (hasLocation) {
      const circle = L.circle([lat, lng], {
        radius: 100,
        color: "rgba(219,83,117,0.25)",
        fillColor: "rgba(219,83,117,0.06)",
        fillOpacity: 1,
        weight: 1,
      }).addTo(map)
      markersRef.current.push(circle)
    }

    const incidents = generateIncidents(lat, lng)
    incidents.forEach((inc) => {
      const color = getSeverityColor(inc.severity)
      const icon = L.divIcon({
        className: "custom-incident-marker",
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 8px ${color}80;cursor:pointer;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })
      const marker = L.marker([inc.lat, inc.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui,sans-serif;font-size:12px;color:#111827;background:#ffffff;padding:8px 12px;border-radius:10px;min-width:120px;border:1px solid #e5e7eb;">
            <strong style="color:#111827;text-transform:capitalize;">${inc.type}</strong><br/>
            <span style="color:${color};font-weight:600;text-transform:capitalize;">${inc.severity} severity</span><br/>
            <span style="color:#6b7280;">${inc.time}</span>
          </div>`,
          { className: "map-popup" }
        )
      markersRef.current.push(marker)
    })

    const places = generateSafePlaces(lat, lng)
    places.forEach((place) => {
      const icon = L.divIcon({
        className: "custom-safe-marker",
        html: `<div style="width:24px;height:24px;border-radius:8px;background:rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center;border:1px solid rgba(99,102,241,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui,sans-serif;font-size:12px;color:#111827;background:#ffffff;padding:8px 12px;border-radius:10px;border:1px solid #e5e7eb;">
            <strong style="color:#4f46e5;">${place.name}</strong>
          </div>`,
          { className: "map-popup" }
        )
      markersRef.current.push(marker)
    })

    const dangerZones = [
      { lat: lat + 0.004, lng: lng - 0.003, radius: 150, color: "rgba(239,68,68,0.1)" },
      { lat: lat - 0.003, lng: lng + 0.005, radius: 120, color: "rgba(239,68,68,0.12)" },
      { lat: lat + 0.002, lng: lng + 0.001, radius: 100, color: "rgba(234,179,8,0.08)" },
    ]
    dangerZones.forEach((zone) => {
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: "transparent",
        fillColor: zone.color,
        fillOpacity: 1,
        weight: 0,
      }).addTo(map)
      markersRef.current.push(circle)
    })

    if (!document.getElementById("leaflet-pulse-css")) {
      const style = document.createElement("style")
      style.id = "leaflet-pulse-css"
      style.textContent = `
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .map-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .map-popup .leaflet-popup-content { margin: 0 !important; }
        .map-popup .leaflet-popup-tip {
          background: #ffffff !important;
          border: 1px solid #e5e7eb;
        }
        .leaflet-control-zoom a {
          background: #ffffff !important;
          color: #111827 !important;
          border-color: #e5e7eb !important;
          border-radius: 8px !important;
        }
        .leaflet-control-zoom a:hover { background: #f3f4f6 !important; }
        .leaflet-control-zoom { border-radius: 10px !important; overflow: hidden; border: none !important; }
      `
      document.head.appendChild(style)
    }
  }, [leafletLoaded, lat, lng, loading, hasLocation])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15, { animate: true })
    }
  }

  if (loading || !leafletLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-border bg-muted/30",
          fullscreen ? "h-full" : "h-64 lg:h-80"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-[11px] text-muted-foreground">
            {loading ? "Getting your location..." : "Loading map..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border",
        fullscreen ? "h-full" : "h-64 lg:h-80"
      )}
    >
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-3 right-3 z-[1000] h-8 w-8 rounded-xl border border-border bg-card/90 backdrop-blur-sm hover:bg-secondary"
        onClick={handleRecenter}
        aria-label="Re-center map on your location"
      >
        <LocateFixed className="h-4 w-4 text-primary" />
      </Button>
    </div>
  )
}
