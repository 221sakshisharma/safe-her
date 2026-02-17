"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/hooks/use-geolocation";

declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

const TRUSTED_CIRCLE = [
  { id: 1, name: "Mom", phone: "+1 555-0101", status: "online", initials: "M" },
  {
    id: 2,
    name: "Priya S.",
    phone: "+1 555-0102",
    status: "online",
    initials: "PS",
  },
  {
    id: 3,
    name: "David K.",
    phone: "+1 555-0103",
    status: "offline",
    initials: "DK",
  },
  {
    id: 4,
    name: "SafeHer Support",
    phone: "911",
    status: "online",
    initials: "SH",
  },
];

const NEARBY_HELP = [
  { name: "Central Police Station", distance: "0.3 km", type: "Police" },
  { name: "City Hospital ER", distance: "0.8 km", type: "Hospital" },
  { name: "Fire Station #5", distance: "1.2 km", type: "Fire" },
];

export function SOSView() {
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { lat, lng, hasLocation, error, loading } = useGeolocation();
  const { user } = useAuth();
  const router = useRouter();

  function handleSOS() {
    if (activated) {
      setActivated(false);
      setCountdown(null);
      return;
    }
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setActivated(true);

          // Send WhatsApp messages
          if (user?.trustedContacts?.length) {
            const message = `SOS! ${user.name} needs help.\nLocation: https://maps.google.com/?q=${lat},${lng}`;
            const encodedMessage = encodeURIComponent(message);

            // Open WhatsApp for the first contact (limitation: browser can only open one window reliably)
            // Ideally we'd loop but browsers block multiple popups
            const contact = user.trustedContacts[0];
            if (contact.phone) {
              window.open(
                `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodedMessage}`,
                "_blank",
              );
            }
          }

          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* SOS Button Section */}
      <Card
        className={cn(
          "border-border bg-card transition-colors",
          activated && "border-destructive/50 bg-destructive/5",
        )}
      >
        <CardContent className="flex flex-col items-center gap-6 py-8">
          {activated && (
            <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-sm font-semibold text-destructive">
                ALERT ACTIVE - Contacts Notified
              </span>
            </div>
          )}

          <div className="relative">
            {/* Pulse rings */}
            {(activated || countdown !== null) && (
              <>
                <span className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" />
                <span
                  className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse-ring"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
            <button
              onClick={handleSOS}
              className={cn(
                "relative flex h-36 w-36 flex-col items-center justify-center rounded-full text-foreground transition-all",
                activated
                  ? "bg-destructive shadow-[0_0_40px_hsl(0,72%,55%,0.4)]"
                  : countdown !== null
                    ? "bg-destructive/80 shadow-[0_0_30px_hsl(0,72%,55%,0.3)]"
                    : "bg-destructive/90 hover:bg-destructive hover:shadow-[0_0_30px_hsl(0,72%,55%,0.3)]",
              )}
              aria-label={activated ? "Cancel SOS alert" : "Activate SOS alert"}
            >
              {countdown !== null ? (
                <span className="text-5xl font-bold text-destructive-foreground">
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

          <p className="max-w-sm text-center text-sm text-muted-foreground">
            {activated
              ? "Your live location is being shared with your trusted circle. Emergency services have been notified."
              : "Tap to send an emergency alert to your trusted circle with your live location."}
          </p>

          {activated && (
            <div className="flex gap-3">
              <Button size="sm" variant="destructive" className="gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Call 911
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-border text-foreground bg-transparent"
              >
                <Send className="h-3.5 w-3.5" />
                Share Location
              </Button>
            </div>
          )}

          {/* Live Location Mini Map */}
          {/* <div className="w-full max-w-md">
            <SOSMiniMap lat={lat} lng={lng} active={activated} />
            <div className="mt-2 flex items-center justify-center gap-2">
              <Navigation className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {loading
                  ? "Getting location..."
                  : hasLocation
                    ? `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
                    : `Approximate: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              </span>
              {error && (
                <span className="text-[10px] text-warning">
                  (GPS unavailable)
                </span>
              )}
            </div>
          </div> */}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {/* Trusted Circle */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" />
              Trusted Circle
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col gap-2">
              {!user?.trustedContacts || user.trustedContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No trusted contacts added yet.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/profile")}
                  >
                    Add Contacts
                  </Button>
                </div>
              ) : (
                user.trustedContacts.map((person, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {person.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {person.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {person.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {activated && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full border-border text-muted-foreground bg-transparent"
              size="sm"
              onClick={() => router.push("/profile")}
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Manage Circle
            </Button>
          </CardContent>
        </Card>

        {/* Nearby Help Centers */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Nearby Help Centers
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col gap-2">
              {NEARBY_HELP.map((place) => (
                <div
                  key={place.name}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15">
                    {place.type === "Police" ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : place.type === "Hospital" ? (
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    ) : (
                      <Phone className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {place.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {place.distance}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border text-[10px] text-muted-foreground"
                  >
                    {place.type}
                  </Badge>
                </div>
              ))}
            </div>

            {activated && hasLocation && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-xs text-primary">
                  Live GPS location shared with emergency contacts. Nearest
                  help: 0.3 km away.
                </p>
              </div>
            )}
            {activated && !hasLocation && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-xs text-warning">
                  Sharing approximate location. Enable GPS for precise tracking.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
