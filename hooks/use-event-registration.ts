"use client"

import { useState, useEffect } from "react"

export function useEventRegistration() {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load registered events from localStorage on initial render
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem("registeredEvents")
      if (storedEvents) {
        setRegisteredEvents(JSON.parse(storedEvents))
      }
    } catch (error) {
      console.error("Error loading registered events from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Check if an event is registered
  const isEventRegistered = (eventId: number): boolean => {
    return registeredEvents.includes(eventId)
  }

  // Register an event
  const registerEvent = (eventId: number) => {
    if (!registeredEvents.includes(eventId)) {
      const updatedEvents = [...registeredEvents, eventId]
      setRegisteredEvents(updatedEvents)
      localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents))
      return true
    }
    return false
  }

  // Unregister an event
  const unregisterEvent = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      const updatedEvents = registeredEvents.filter((id) => id !== eventId)
      setRegisteredEvents(updatedEvents)
      localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents))
      return true
    }
    return false
  }

  return {
    isLoaded,
    registeredEvents,
    isEventRegistered,
    registerEvent,
    unregisterEvent,
  }
}
