"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Shield, MapPin, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      "Hi there. I'm your safety assistant. I have access to real-time data about incidents, safety scores, and risk predictions for your area. How can I help?",
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
    "Your area has a Safety Score of 72/100 (Moderate). There have been 3 incidents within 100m in the last 24 hours, primarily theft-related. The area is well-lit and has a police station 0.3 km away. I'd recommend staying aware of your surroundings, especially after 8 PM when risk levels increase.",
  "Best time to walk home?":
    "The safest window for walking is between 6 AM and 6 PM, with the lowest risk around 10 AM (12% probability). Risk increases significantly after 8 PM, peaking at 10 PM - 12 AM (72%). If you need to walk after dark, I recommend Cedar Boulevard which has continuous street lighting and CCTV coverage.",
  "Safest route to the station?":
    "I've analyzed 3 routes to Central Station:\n\n1. Via Main Street (0.8 km, 12 min) - Safety: HIGH. Well-lit, commercial area, CCTV.\n2. Via Oak Park (0.6 km, 9 min) - Safety: MODERATE. Shorter but has dim sections.\n3. Via Elm Street (1.1 km, 15 min) - Safety: LOW. Recent harassment reports.\n\nI recommend Route 1 via Main Street.",
  "Any recent incidents nearby?":
    "In the last 24 hours within 100m:\n\n- Verbal harassment near Elm St & 5th Ave (2h ago) - HIGH severity\n- Phone snatching on Cedar Boulevard (3h ago) - HIGH severity\n- Suspicious activity near Riverside Playground - MEDIUM severity\n\nTheft incidents are down 15% from last month, but harassment reports have increased 5% on weekends.",
}

export function AIAssistantView() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  function handleSend(text?: string) {
    const msg = text || input.trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now(), role: "user", content: msg, timestamp: "Just now" }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = AI_RESPONSES[msg] || `Based on current safety data, your area has moderate risk levels with a Safety Score of 72/100. For personalized advice, try asking about specific routes, times, or safety concerns.`
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: response, timestamp: "Just now" }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-5">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={cn("flex gap-3 animate-fade-in-up", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                msg.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3",
                msg.role === "assistant"
                  ? "rounded-tl-sm border border-border/40 bg-card"
                  : "rounded-tr-sm bg-primary text-primary-foreground"
              )}>
                <p className="whitespace-pre-line text-[13px] leading-relaxed">{msg.content}</p>
                <p className={cn("mt-1.5 text-[10px]", msg.role === "assistant" ? "text-muted-foreground/50" : "text-primary-foreground/50")}>{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-card px-4 py-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/30" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="mb-3 grid grid-cols-2 gap-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => handleSend(prompt.text)}
              className="flex items-center gap-2 rounded-xl border border-border/40 bg-card px-3 py-2.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <prompt.icon className="h-3.5 w-3.5 shrink-0 text-primary/60" />
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
          className="flex-1 rounded-xl border border-border/40 bg-card px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all"
          aria-label="Message input"
        />
        <Button
          size="icon"
          className="h-[46px] w-[46px] shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
