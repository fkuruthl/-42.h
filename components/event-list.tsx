"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample event data
const upcomingEvents = [
  {
    id: 1,
    title: "Meet up",
    description: "AMA Session with Learning Team",
    date: "14",
    day: "Wed",
    month: "May",
    duration: "1h",
    countdown: "in 3 days",
    location: "42AD Makerspace",
    color: "#00c2c7",
    registered: false,
  },
  {
    id: 2,
    title: "Hackathon",
    description: "AI Hackathon: AI for Safe and Sustainable Energy",
    date: "27",
    day: "Tue",
    month: "May",
    duration: "24h",
    countdown: "in 16 days",
    location: "42AD Campus",
    color: "#1ed760",
    registered: true,
  },
  {
    id: 3,
    title: "Piscine",
    description: "Piscine Data Science -- Advanced Curriculum",
    date: "2",
    day: "Mon",
    month: "June",
    duration: "6d",
    countdown: "in 22 days",
    location: "42 Berlin, Germany",
    color: "#ff6b6b",
    registered: false,
  },
]

export default function EventList() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {upcomingEvents.map((event) => (
        <motion.div
          key={event.id}
          className="flex rounded overflow-hidden border border-[#333333] bg-[#252525]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
          onHoverStart={() => setHoveredId(event.id)}
          onHoverEnd={() => setHoveredId(null)}
        >
          {/* Date sidebar */}
          <div
            className="w-24 flex-shrink-0 flex flex-col items-center justify-center py-4 text-white"
            style={{ backgroundColor: event.color }}
          >
            <span className="text-sm font-medium">{event.day}</span>
            <span className="text-3xl font-bold">{event.date}</span>
            <span className="text-sm font-medium">{event.month}</span>
          </div>

          {/* Event details */}
          <div className="flex-grow p-4 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold font-mono text-white" style={{ color: event.color }}>
                  {event.title}
                </h3>
                <p className="text-[#f5f5f5] mb-3">{event.description}</p>
              </div>
              {event.registered && (
                <span className="text-xs font-medium px-2 py-1 bg-[#1ed760]/10 text-[#1ed760]">REGISTERED</span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[#f5f5f5]">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" style={{ color: event.color }} />
                <span>{event.duration}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" style={{ color: event.color }} />
                <span>{event.countdown}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" style={{ color: event.color }} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Hover reveal button */}
          <motion.div
            className="w-16 flex items-center justify-center"
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: hoveredId === event.id ? 1 : 0,
              width: hoveredId === event.id ? 60 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/events/${event.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                style={{ color: event.color, borderColor: event.color }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
