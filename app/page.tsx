"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardView } from "@/components/dashboard-view";
import { MapView } from "@/components/map-view";
import { SOSView } from "@/components/sos-view";
import { AIAssistantView } from "@/components/ai-assistant-view";
import { SafeRoutesView } from "@/components/safe-routes-view";
import { CommunityView } from "@/components/community-view";
import { SafetyProvider } from "@/context/safety-context";

export default function Page() {
  const [activeView, setActiveView] = useState("dashboard");

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
