"use client"

import { useState } from "react"
import {
  MapPin,
  Clock,
  ThumbsUp,
  Plus,
  AlertTriangle,
  Eye,
  ShieldOff,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "Harassment", "Theft", "Suspicious", "Unsafe Area", "Lighting"]

const REPORTS = [
  {
    id: 1,
    type: "Harassment",
    description:
      "Verbal harassment near the transit stop on Elm Street. Group of individuals making threatening remarks to passersby.",
    location: "Elm Street & 5th Ave",
    time: "2 hours ago",
    upvotes: 12,
    verified: true,
    severity: "high",
  },
  {
    id: 2,
    type: "Unsafe Area",
    description:
      "Poor street lighting on the stretch between Oak Park and Main Square. Multiple residents have reported feeling unsafe.",
    location: "Oak Park to Main Square",
    time: "5 hours ago",
    upvotes: 28,
    verified: true,
    severity: "medium",
  },
  {
    id: 3,
    type: "Suspicious",
    description:
      "Unmarked van parked near the playground for several hours. No one seen entering or leaving.",
    location: "Riverside Playground",
    time: "1 day ago",
    upvotes: 7,
    verified: false,
    severity: "medium",
  },
  {
    id: 4,
    type: "Theft",
    description:
      "Phone snatching incident while walking. The individual fled on a bicycle heading south.",
    location: "Cedar Boulevard",
    time: "3 hours ago",
    upvotes: 15,
    verified: true,
    severity: "high",
  },
  {
    id: 5,
    type: "Lighting",
    description:
      "Three consecutive street lights are out near the community center. Area is extremely dark after 7 PM.",
    location: "Community Center Rd",
    time: "2 days ago",
    upvotes: 34,
    verified: true,
    severity: "low",
  },
]

function getTypeIcon(type: string) {
  switch (type) {
    case "Harassment":
      return AlertTriangle
    case "Theft":
      return ShieldOff
    case "Suspicious":
      return Eye
    default:
      return MapPin
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "high":
      return "border-destructive/20 bg-destructive/10 text-destructive"
    case "medium":
      return "border-warning/20 bg-warning/10 text-warning"
    default:
      return "border-primary/20 bg-primary/10 text-primary"
  }
}

export function CommunityView() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [reportOpen, setReportOpen] = useState(false)

  const filtered =
    activeCategory === "All"
      ? REPORTS
      : REPORTS.filter((r) => r.type === activeCategory)

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h3 className="text-base font-semibold text-foreground">Community Reports</h3>
          <p className="text-[13px] text-muted-foreground">
            {REPORTS.length} reports in your area
          </p>
        </div>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-foreground rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Submit Incident Report</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="report-type"
                  className="text-[13px] font-medium text-foreground"
                >
                  Incident Type
                </label>
                <div className="relative">
                  <select
                    id="report-type"
                    className="w-full appearance-none rounded-xl border border-border bg-accent px-3 py-2.5 text-[13px] text-foreground"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select type...
                    </option>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="report-location"
                  className="text-[13px] font-medium text-foreground"
                >
                  Location
                </label>
                <Input
                  id="report-location"
                  placeholder="Enter location or use current"
                  className="rounded-xl border-border bg-accent text-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="report-desc"
                  className="text-[13px] font-medium text-foreground"
                >
                  Description
                </label>
                <Textarea
                  id="report-desc"
                  placeholder="Describe the incident..."
                  rows={3}
                  className="rounded-xl border-border bg-accent text-foreground"
                />
              </div>
              <Button
                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setReportOpen(false)}
              >
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-in" style={{ animationDelay: "80ms" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-200",
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-3">
        {filtered.map((report, i) => {
          const Icon = getTypeIcon(report.type)
          return (
            <div
              key={report.id}
              className="rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-sm animate-fade-in"
              style={{ animationDelay: `${(i + 1) * 60}ms` }}
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Icon className="h-[18px] w-[18px] text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-foreground">
                        {report.type}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[10px]",
                          getSeverityBadge(report.severity)
                        )}
                      >
                        {report.severity}
                      </Badge>
                      {report.verified && (
                        <Badge
                          variant="outline"
                          className="rounded-full border-primary/20 bg-primary/10 text-[10px] text-primary"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {report.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.time}
                    </span>
                    <button className="flex items-center gap-1 transition-colors hover:text-primary">
                      <ThumbsUp className="h-3 w-3" />
                      {report.upvotes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
