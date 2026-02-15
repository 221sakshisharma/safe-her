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
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden"
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
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-sidebar transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 pb-2 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-sidebar-foreground">
              SafeHer
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-6" aria-label="Main navigation">
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
                      "flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                      isActive && !isSOS
                        ? "bg-primary/10 text-primary"
                        : isSOS
                          ? "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {isSOS && (
                      <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mb-3 flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute ml-0 h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="ml-4">Appearance</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 rounded-[10px] bg-accent/60 px-3 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
              S
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Sarah</p>
              <p className="text-[10px] text-muted-foreground">Protected</p>
            </div>
            <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
          </div>
        </div>
      </aside>

      {/* Subtle separator */}
      <div className="hidden w-px bg-border lg:block" />

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar - ultra minimal */}
        <header className="flex items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-[10px] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              {navItems.find((n) => n.id === activeView)?.label}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-[10px] text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
            onClick={() => onViewChange("sos")}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[13px]">SOS</span>
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
