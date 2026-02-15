"use client"

import React from "react"
import { useState } from "react"
import {
  Shield,
  Map,
  AlertTriangle,
  MessageSquare,
  Navigation,
  Users,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Shield },
  { id: "map", label: "Safety Map", icon: Map },
  { id: "sos", label: "SOS", icon: AlertTriangle },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare },
  { id: "routes", label: "Safe Routes", icon: Navigation },
  { id: "community", label: "Community", icon: Users },
]

export function AppShell({
  activeView,
  onViewChange,
  children,
}: {
  activeView: string
  onViewChange: (view: string) => void
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-sidebar-foreground">
                SafeHer
              </h1>
              <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                Safety Companion
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Navigation
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = activeView === item.id
              const isSOS = item.id === "sos"
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id)
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      isActive && !isSOS
                        ? "bg-primary/10 text-primary"
                        : isSOS
                          ? "text-destructive/80 hover:bg-destructive/5 hover:text-destructive"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] transition-all",
                        isSOS && isActive && "animate-pulse"
                      )}
                    />
                    {item.label}
                    {isSOS && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="ml-4">Toggle theme</span>
          </button>

          {/* User card */}
          <div className="flex items-center gap-3 rounded-xl bg-accent/60 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Sarah A.</p>
              <p className="text-[11px] text-muted-foreground">Protected</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-success" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {navItems.find((n) => n.id === activeView)?.label}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Real-time safety intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="absolute right-2 top-2 flex h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="hidden gap-1.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 sm:flex"
              onClick={() => onViewChange("sos")}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              SOS
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
