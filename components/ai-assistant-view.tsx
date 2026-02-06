"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Shield, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your SafeHer AI Safety Assistant. I can help you with personalized safety advice based on real-time data from your area. I have access to current incident reports, safety scores, and risk predictions. How can I help you stay safe today?",
    timestamp: "Just now",
  },
]

const SUGGESTED_PROMPTS = [
  { text: "Is my current area safe?", icon: Shield },
  { text: "Best time to walk home?", icon: Clock },
  { text: "Safest route to the station?", icon: MapPin },
  { text: "Any recent incidents nearby?", icon: Sparkles },
]

const AI_RESPONSES: Record<string, string> = {
  "Is my current area safe?":
    "Based on current data, your area has a Safety Score of 72/100 (Moderate). There have been 3 incidents within 100m in the last 24 hours, primarily theft-related. The area is well-lit and has a police station 0.3 km away. I'd recommend staying aware of your surroundings, especially after 8 PM when risk levels increase. Would you like me to suggest a safer alternative route?",
  "Best time to walk home?":
    "Based on our risk prediction model, the safest window for walking in your area is between 6 AM and 6 PM, with the lowest risk around 10 AM (12% probability). Risk increases significantly after 8 PM, peaking at 10 PM - 12 AM (72% probability). If you need to walk after dark, I recommend taking Cedar Boulevard which has continuous street lighting and CCTV coverage. Would you like me to set a safety reminder?",
  "Safest route to the station?":
    "I've analyzed 3 possible routes to Central Station:\n\n1. Via Main Street (0.8 km, 12 min) - Safety: HIGH. Well-lit, commercial area, CCTV coverage.\n\n2. Via Oak Park (0.6 km, 9 min) - Safety: MODERATE. Shorter but passes through a dimly-lit section near the park.\n\n3. Via Elm Street (1.1 km, 15 min) - Safety: LOW. Recent harassment reports in this area.\n\nI recommend Route 1 via Main Street. Would you like me to start navigation?",
  "Any recent incidents nearby?":
    "In the last 24 hours within your 100m radius:\n\n- Verbal harassment near Elm St & 5th Ave (2h ago, verified) - HIGH severity\n- Phone snatching on Cedar Boulevard (3h ago, verified) - HIGH severity\n- Suspicious activity near Riverside Playground (reported by community) - MEDIUM severity\n\nOverall trend: Theft incidents are down 15% from last month, but harassment reports have increased 5%, particularly on weekends. I recommend avoiding the Elm Street corridor after dark.",
}

export function AIAssistantView() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleSend(text?: string) {
    const msg = text || input.trim()
    if (!msg) return

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: msg,
      timestamp: "Just now",
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response =
        AI_RESPONSES[msg] ||
        `Based on current safety data for your location, I can see that your area has moderate risk levels. The Safety Score is 72/100 with 3 recent incidents nearby. For the most personalized advice, try asking about specific routes, times, or safety concerns. I'm here to help you navigate safely.`

      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* System Context Banner */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          AI Assistant has access to: Safety Score (72), 7 nearby incidents, risk predictions, and community reports. All responses are context-aware.
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
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  msg.role === "assistant"
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground"
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
                    : "rounded-tr-sm bg-primary text-primary-foreground"
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
                      : "text-primary-foreground/70"
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
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
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
  )
}
