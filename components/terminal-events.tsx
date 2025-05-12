"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"
import { useEventRegistration } from "@/hooks/use-event-registration"

// Sample event data
const upcomingEvents = [
  {
    id: 1,
    title: "Meet up",
    description: "AMA Session with Learning Team",
    location: "42AD Makerspace",
    date: "May 14, 2025",
    color: "#00c2c7", // Teal
    duration: "1h",
    countdown: "in 3 days",
  },
  {
    id: 2,
    title: "Hackathon",
    description: "AI Hackathon: AI for Safe and Sustainable Energy",
    location: "42AD Campus",
    date: "May 27, 2025",
    color: "#1ed760", // Green
    duration: "24h",
    countdown: "in 16 days",
  },
  {
    id: 3,
    title: "Piscine",
    description: "Piscine Data Science -- Advanced Curriculum",
    location: "42 Berlin, Germany",
    date: "June 2, 2025",
    color: "#ff6b6b", // Coral
    duration: "6d",
    countdown: "in 22 days",
  },
]

export default function TerminalEvents() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {upcomingEvents.map((event, index) => (
        <TerminalEventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  )
}

interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  color: string
  duration: string
  countdown: string
}

function TerminalEventCard({ event, index }: { event: Event; index: number }) {
  const [blinkCursor, setBlinkCursor] = useState(true)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const { addNotification } = useNotification()
  const { isLoaded, isEventRegistered, registerEvent } = useEventRegistration()
  const [isRegistered, setIsRegistered] = useState(false)

  // Check registration status from localStorage when component loads
  useEffect(() => {
    if (isLoaded) {
      setIsRegistered(isEventRegistered(event.id))
    }
  }, [isLoaded, isEventRegistered, event.id])

  useEffect(() => {
    // Blink the cursor only if not registered
    if (!isRegistered && !isTyping) {
      const cursorInterval = setInterval(() => {
        setBlinkCursor((prev) => !prev)
      }, 500)

      return () => {
        clearInterval(cursorInterval)
      }
    }
  }, [isRegistered, isTyping])

  // Simplified JSON for smaller screens
  const jsonContent = isMobile
    ? `{ "id": ${event.id}, "title": "${event.title}" }`
    : isTablet
      ? `{
  "id": ${event.id},
  "title": "${event.title}",
  "date": "${event.date}"
}`
      : `{
  "id": ${event.id},
  "title": "${event.title}",
  "location": "${event.location}",
  "date": "${event.date}"
}`

  const handleRegister = () => {
    setIsTyping(true)
    setBlinkCursor(false)

    // Type out "REGISTERED" letter by letter
    const text = "REGISTERED"
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)

        // After typing is complete, set as registered
        setIsRegistered(true)
        setIsTyping(false)

        // Update localStorage
        registerEvent(event.id)

        // Show notification
        addNotification(`You've registered for "${event.title}"!`, "success")
      }
    }, 100)
  }

  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="overflow-hidden rounded-md shadow-2xl h-full flex flex-col bg-[#1e1e1e]"
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="w-4 h-4 rounded-full bg-[#00eaff] animate-pulse"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-md shadow-2xl h-full flex flex-col"
    >
      {/* Terminal header */}
      <div className="bg-[#2d2d2d] px-3 sm:px-4 py-2 sm:py-3 flex items-center">
        <div className="flex space-x-1.5 sm:space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="ml-3 sm:ml-4 text-xs sm:text-sm text-center flex-grow font-mono truncate">
          events.42abudhabi.sh
        </div>
      </div>

      {/* Terminal content */}
      <div className="bg-[#1e1e1e] p-3 sm:p-4 font-mono text-xs sm:text-sm flex-grow flex flex-col">
        {/* Event details in JSON format */}
        <div className="text-[#f5f5f5] mb-3 sm:mb-4 text-xs overflow-x-auto scrollbar-hide">
          <pre className="whitespace-pre-wrap break-words">{jsonContent}</pre>
        </div>

        {/* Command line */}
        <div className="mt-auto">
          {/* Event name and date */}
          <div className="flex flex-wrap items-center mb-2">
            <span className="text-[#ff2c2c] font-medium">{event.title}</span>
            <span className="text-white mx-2">-</span>
            <span className="text-white">{event.date}</span>
          </div>

          {/* Final cursor or register button */}
          <div className="flex items-center justify-between mt-2 w-full">
            <div className="flex items-center">
              <span className="text-[#00eaff] mr-2">$</span>
              {isRegistered ? (
                <span className="text-[#1ed760]">{typedText || "REGISTERED"}</span>
              ) : isTyping ? (
                <span className="text-[#1ed760]">
                  {typedText}
                  <span className="animate-pulse">█</span>
                </span>
              ) : (
                <span className={blinkCursor ? "opacity-100" : "opacity-0"}>█</span>
              )}
            </div>

            {isRegistered ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs border-[#333333] text-[#1ed760] min-w-[90px]"
              >
                ✓ Registered
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegister}
                disabled={isTyping}
                className="text-xs border-[#333333] hover:border-[#1ed760] hover:text-[#1ed760] min-w-[90px]"
              >
                Register
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* View details button */}
      <Link href={`/events/${event.id}`} className="block" prefetch={true}>
        <div
          className="py-2 px-3 sm:px-4 text-center font-mono text-xs sm:text-sm hover:bg-[#252525] transition-colors flex justify-between items-center"
          style={{ borderTop: `1px solid #333` }}
        >
          <span className="text-[#f5f5f5]">View Details</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00eaff]" />
        </div>
      </Link>
    </motion.div>
  )
}
