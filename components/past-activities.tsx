"use client";

import { History, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Incident {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

export function PastActivities({ incidents = [] }: { incidents?: Incident[] }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-primary" />
            Recent Incidents
          </CardTitle>
          <span className="text-xs text-muted-foreground">Nearby News</span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {incidents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent incidents found nearby.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {incidents.slice(0, 5).map((incident, i) => (
              <a
                key={i}
                href={incident.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-lg bg-secondary/50 px-3 py-2.5 transition-colors hover:bg-secondary"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                    {incident.title}
                  </p>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{incident.source}</span>
                  <span>
                    {formatDistanceToNow(new Date(incident.pubDate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
