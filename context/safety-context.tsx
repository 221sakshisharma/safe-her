"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";

interface Incident {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

interface SafetyContextType {
  location: { lat: number; lng: number } | null;
  locationName: string;
  fullAddress: string;
  safetyScore: number;
  riskLevel: string;
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  const { lat, lng, loading: geoLoading, error: geoError } = useGeolocation();
  const [data, setData] = useState<{
    location: string;
    fullAddress: string;
    safetyScore: number;
    riskLevel: string;
    incidents: Incident[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSafetyData = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/incidents?lat=${latitude}&lng=${longitude}`,
      );
      if (!res.ok) throw new Error("Failed to fetch safety data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Could not load safety information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lng) {
      fetchSafetyData(lat, lng);
    }
  }, [lat, lng]);

  const refresh = () => {
    if (lat && lng) fetchSafetyData(lat, lng);
  };

  return (
    <SafetyContext.Provider
      value={{
        location: lat && lng ? { lat, lng } : null,
        locationName: data?.location || "Unknown Location",
        fullAddress: data?.fullAddress || "",
        safetyScore: data?.safetyScore ?? 0,
        riskLevel: data?.riskLevel || "Unknown",
        incidents: data?.incidents || [],
        loading: loading || geoLoading,
        error: error || (geoError ? "Location access denied" : null),
        refresh,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error("useSafety must be used within a SafetyProvider");
  }
  return context;
}
