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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">SafeHer</h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                AI Safety Platform
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
          <ul className="flex flex-col gap-1">
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
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive && !isSOS
                        ? "bg-primary/10 text-primary"
                        : isSOS
                          ? "text-destructive hover:bg-destructive/10"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn("h-4.5 w-4.5", isSOS && "animate-pulse")} />
                    {item.label}
                    {isSOS && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              SA
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Sarah A.</p>
              <p className="text-xs text-muted-foreground">Protected</p>
            </div>
            <span className="flex h-2.5 w-2.5 rounded-full bg-success" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {navItems.find((n) => n.id === activeView)?.label}
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time safety intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="hidden gap-1.5 sm:flex"
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
