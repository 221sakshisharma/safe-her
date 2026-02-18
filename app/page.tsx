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
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { ProfileView } from "@/components/profile-view";

export default function Page() {
  const [activeView, setActiveView] = useState("landing");
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has already launched the app
    const hasLaunched = localStorage.getItem("safeher_launched");

    // If we have a user, go straight to dashboard
    if (user) {
      setActiveView("dashboard");
    } else if (hasLaunched) {
      // If launched before but no user (logged out), user should probably login
      // But for now let's respect the "launched" flag to show dashboard
      // OR better: redirect to login if they try to access dashboard without auth?
      // For this requirement: "landing -> register/login -> dashboard"

      // If not logged in, we should show landing page or redirect to login
      // Let's stick to Landing Page if no user
      setActiveView("landing");
    }

    setIsInitialized(true);
  }, [user]);

  const handleGetStarted = () => {
    // "Get Started" on landing page goes to Register
    router.push("/register");
  };

  // Prevent flash
  if (!isInitialized || loading) return null;

  // If not logged in, show Landing Page
  if (!user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // If logged in, show Dashboard
  return (
    <SafetyProvider>
      <AppShell activeView={activeView} onViewChange={setActiveView}>
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "map" && <MapView />}
        {activeView === "sos" && <SOSView />}
        {activeView === "assistant" && <AIAssistantView />}
        {activeView === "routes" && <SafeRoutesView />}
        {activeView === "community" && <CommunityView />}
        {activeView === "profile" && <ProfileView />}
      </AppShell>
    </SafetyProvider>
  );
}
