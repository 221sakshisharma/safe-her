"use client";

import { Shield, MapPin, Activity, Bell, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              SafeHer
            </span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={onGetStarted}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={onGetStarted}
            >
              About
            </Button>
            <Button onClick={onGetStarted} size="sm">
              Launch App
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden flex justify-center">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 mix-blend-multiply" />
          </div>
          <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Navigate Your World with{" "}
                  <span className="text-primary">Confidence</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Real-time safety intelligence, AI-powered risk analysis, and
                  community-driven alerts designed specifically for women's
                  safety.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6">
                <Button className="h-12 px-8 text-base" onClick={onGetStarted}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-8 text-base"
                  onClick={onGetStarted}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full border-t border-border bg-muted/30 py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Live Risk Assessment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get real-time safety scores for your current location based on
                  verified incident reports and news data.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Smart Navigation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Find the safest routes, not just the fastest ones. Avoid
                  high-risk zones with intelligent pathfinding.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Bell className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Instant SOS</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One-tap emergency alerts to your trusted contacts and nearby
                  authorities with your live location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Preview */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden flex justify-center">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    AI Powered Safety
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Your Personal <br className="hidden lg:inline" />
                    Safety Companion
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Chat with our advanced AI to get instant, context-aware
                    advice about neighborhood safety, best travel times, and
                    emergency protocols. It analyzes thousands of real-time data
                    points to keep you informed and safe.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="h-12 px-8"
                    onClick={onGetStarted}
                  >
                    Try AI Chat Now
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all hover:shadow-primary/10">
                  <div className="border-b border-border bg-muted/30 p-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      SafeHer Assistant
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-6 bg-gradient-to-b from-card to-muted/10">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-muted/50 p-4 text-sm shadow-sm">
                        Is it safe to walk near Central Park right now?
                      </div>
                    </div>
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="rounded-2xl rounded-tr-none bg-primary/5 border border-primary/10 p-4 text-sm text-foreground shadow-sm">
                        <p className="font-semibold text-primary mb-1">
                          Risk Level: Moderate
                        </p>
                        Current data shows increased activity. I recommend
                        sticking to the main path which is well-lit. Avoid the
                        north entrance after 8 PM.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6 max-w-7xl">
          <p className="text-xs text-muted-foreground">
            © 2024 SafeHer Inc. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </a>
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
