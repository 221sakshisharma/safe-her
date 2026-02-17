"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import {
  MapPin,
  Clock,
  ThumbsUp,
  Plus,
  Filter,
  AlertTriangle,
  Eye,
  ShieldOff,
  ChevronDown,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "alert", "update", "question"];

function getTypeIcon(type: string) {
  switch (type) {
    case "alert":
      return AlertTriangle;
    case "question":
      return MessageSquare;
    default:
      return Eye;
  }
}

interface Post {
  _id: string;
  userName: string;
  content: string;
  location: string;
  type: string;
  likes: number;
  createdAt: string;
}

export function CommunityView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [reportOpen, setReportOpen] = useState(false);
  const { user } = useAuth();

  // New Post State
  const [newContent, setNewContent] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState("update");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newContent || !newLocation) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          location: newLocation,
          type: newType,
        }),
      });

      if (res.ok) {
        setReportOpen(false);
        setNewContent("");
        setNewLocation("");
        fetchPosts(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.type === activeCategory);

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Community Updates
          </h3>
          <p className="text-sm text-muted-foreground">
            {posts.length} posts in your network
          </p>
        </div>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create Community Post
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                >
                  <option value="update">Update</option>
                  <option value="alert">Safety Alert</option>
                  <option value="question">Question</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Location
                </label>
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Central Park"
                  className="border-border bg-secondary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Content
                </label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share what's happening..."
                  className="border-border bg-secondary"
                />
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Posting..." : "Post Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No posts yet.
          </p>
        )}
        {filtered.map((post) => {
          const Icon = getTypeIcon(post.type);
          return (
            <Card key={post._id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {post.userName}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase"
                        >
                          {post.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {post.content}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {post.location}
                      </span>
                      <button className="flex items-center gap-1 transition-colors hover:text-primary">
                        <ThumbsUp className="h-3 w-3" />
                        {post.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
