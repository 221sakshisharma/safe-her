"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Shield, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSafety } from "@/context/safety-context";

interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your SafeHer AI Safety Assistant. I can help you with personalized safety advice based on real-time data from your area. I have access to current incident reports, safety scores, and risk predictions. How can I help you stay safe today?",
    timestamp: "Just now",
  },
];

const SUGGESTED_PROMPTS = [
  { text: "Is my current area safe?", icon: Shield },
  { text: "Best time to walk home?", icon: Clock },
  { text: "Safest route to the station?", icon: MapPin },
  { text: "Any recent incidents nearby?", icon: Sparkles },
];

export function AIAssistantView() {
  const { safetyScore, riskLevel, incidents, locationName, loading } =
    useSafety();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: msg,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Prepare context for the AI
      const context = {
        location: locationName,
        safetyScore,
        riskLevel,
        incidents: incidents.slice(0, 10), // Limit to top 10
      };

      // Filter out system messages and map to API format
      const apiMessages = messages
        .filter((m) => m.role !== "system")
        .concat(userMsg)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          context,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(
          `Failed to get response: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm having trouble connecting to the safety network right now. Please try again.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* System Context Banner */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          AI Assistant has access to: Safety Score (
          {loading ? "..." : safetyScore}), {loading ? "..." : incidents.length}{" "}
          nearby incidents, risk predictions, and community reports. All
          responses are context-aware.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  msg.role === "assistant"
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  msg.role === "assistant"
                    ? "rounded-tl-sm bg-card border border-border"
                    : "rounded-tr-sm bg-primary text-primary-foreground",
                )}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {msg.content}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[10px]",
                    msg.role === "assistant"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70",
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => handleSend(prompt.text)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <prompt.icon className="h-4 w-4 shrink-0 text-primary" />
              {prompt.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about safety in your area..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Message input"
        />
        <Button
          size="icon"
          className="h-12 w-12 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
        >
          <Send className="h-4.5 w-4.5" />
        </Button>
      </div>
    </div>
  );
}
