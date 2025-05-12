"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEventRegistration } from "@/hooks/use-event-registration"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: string
  color: string
  duration: string
  countdown: string
}

export default function EventCard({ event }: { event: Event }) {
  const [isHovered, setIsHovered] = useState(false)
  const { isLoaded, isEventRegistered } = useEventRegistration()
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      setIsRegistered(isEventRegistered(event.id))
    }
  }, [isLoaded, isEventRegistered, event.id])

  return (
    <motion.div
      className="bg-[#252525] border border-[#333333] overflow-hidden h-full flex flex-col relative"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)" }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glowing border effect on hover */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.5 : 0,
          boxShadow: `0 0 20px ${event.color}, 0 0 30px ${event.color}`,
          pointerEvents: "none",
        }}
      ></div>

      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover"
            style={{ filter: "grayscale(50%)" }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${event.color}40 100%)`,
            }}
          ></div>
        </div>

        <Badge
          className="absolute top-4 left-4"
          style={{
            backgroundColor: event.color,
            color: "white",
          }}
        >
          {event.category}
        </Badge>

        {isRegistered && (
          <Badge
            className="absolute top-4 right-4"
            style={{
              backgroundColor: "#1ed760",
              color: "white",
            }}
          >
            REGISTERED
          </Badge>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: event.color }}></div>
      </div>

      <div className="p-6 flex-grow flex flex-col relative z-10">
        <h3 className="text-xl font-bold font-mono mb-3 text-white" style={{ color: event.color }}>
          {event.title}
        </h3>

        <p className="text-[#f5f5f5] mb-4 flex-grow">{event.description}</p>

        <div className="space-y-2 mb-4 text-[#f5f5f5]">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2" style={{ color: event.color }} />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" style={{ color: event.color }} />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2" style={{ color: event.color }} />
            <span>{event.location}</span>
          </div>
        </div>

        <Link href={`/events/${event.id}`} className="mt-auto" prefetch={true}>
          <Button
            variant="outline"
            className="w-full group"
            style={{
              borderColor: event.color,
              color: event.color,
            }}
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
