"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardView } from "@/components/dashboard-view";
import { MapView } from "@/components/map-view";
import { SOSView } from "@/components/sos-view";
import { AIAssistantView } from "@/components/ai-assistant-view";
import { SafeRoutesView } from "@/components/safe-routes-view";
import { CommunityView } from "@/components/community-view";
import { SafetyProvider } from "@/context/safety-context";
import { LandingPage } from "@/components/landing-page";

export default function Page() {
  const [activeView, setActiveView] = useState("landing");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has already launched the app
    const hasLaunched = localStorage.getItem("safeher_launched");
    if (hasLaunched) {
      setActiveView("dashboard");
    }
    setIsInitialized(true);
  }, []);

  const handleLaunch = () => {
    localStorage.setItem("safeher_launched", "true");
    setActiveView("dashboard");
  };

  // Prevent flash of landing page if already launched
  if (!isInitialized) return null;

  if (activeView === "landing") {
    return <LandingPage onGetStarted={handleLaunch} />;
  }

  return (
    <SafetyProvider>
      <AppShell activeView={activeView} onViewChange={setActiveView}>
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "map" && <MapView />}
        {activeView === "sos" && <SOSView />}
        {activeView === "assistant" && <AIAssistantView />}
        {activeView === "routes" && <SafeRoutesView />}
        {activeView === "community" && <CommunityView />}
      </AppShell>
    </SafetyProvider>
  );
}
