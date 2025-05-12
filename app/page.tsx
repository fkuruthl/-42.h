"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import CodeRain from "@/components/code-rain"
import TerminalEvents from "@/components/terminal-events"

interface TypedAnimationProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  textColors?: string[]
}

function TypedAnimation({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 80,
  pauseDuration = 1000,
  textColors = ["#ffffff"],
}: TypedAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false)
        setIsTyping(false)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    const currentPhrase = phrases[currentPhraseIndex]

    if (isTyping) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        setIsPaused(true)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, deletingSpeed)
      } else {
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentPhraseIndex, isTyping, isPaused, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div className="h-[3.5rem] sm:h-[4.5rem] md:h-[5.5rem] lg:h-[6.5rem] flex items-center">
      <span style={{ color: textColors[currentPhraseIndex % textColors.length] }}>
        {displayText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  )
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 md:py-20">
        {/* Code Rain Background */}
        <CodeRain />

        {/* Grid lines */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            {/* Code-like title */}
            <div className="mb-6 font-mono">
              <div className="text-[#8f00ff] mb-2 text-xs sm:text-sm">// 42 Abu Dhabi Events Platform</div>
              <div className="text-[#00eaff] text-sm sm:text-base">
                <span className="text-white">function</span> <span className="text-[#ff2c2c]">main</span>() {"{"}
              </div>
              <div className="ml-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-4">
                <TypedAnimation
                  phrases={["CODE.", "CONNECT.", "CREATE."]}
                  typingSpeed={100}
                  deletingSpeed={80}
                  pauseDuration={1000}
                  textColors={["#ff2c2c", "#00eaff", "#8f00ff"]}
                />
              </div>
              <div className="text-[#00eaff] text-sm sm:text-base">{"}"}</div>
            </div>

            <div className="mb-8 text-base sm:text-lg md:text-xl text-[#f5f5f5]">
              <p>
                Join the most innovative tech events at 42 Abu Dhabi.
                <br />
                Where coders, designers, and visionaries collaborate.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/events" prefetch={true}>
                <Button className="bg-[#ff2c2c] hover:bg-[#ff2c2c]/80 text-white px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg font-mono">
                  Explore Events <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating code elements */}
          <div className="absolute -top-10 -left-10 opacity-20 text-[#00eaff] font-mono text-xs hidden lg:block">
            {"<div className='events-container'>"}
          </div>
          <div className="absolute -bottom-5 -right-5 opacity-20 text-[#00eaff] font-mono text-xs hidden lg:block">
            {"</div>"}
          </div>
          <div className="absolute top-1/4 right-10 opacity-10 text-[#ff2c2c] font-mono text-xs hidden lg:block">
            {"function registerEvent(id) {"}
            <br />
            {"  return fetch('/api/events/' + id);"}
            <br />
            {"}"}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 relative">
        {/* Code comment decoration */}
        <div className="absolute top-10 left-5 opacity-20 text-[#8f00ff] font-mono text-xs hidden lg:block">
          {`
/**
 * @component EventsSection
 * @description Displays upcoming events
 */`}
        </div>

        <div className="container-left-aligned">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-white">
              <span className="text-[#00eaff]">&lt;</span> Upcoming Events <span className="text-[#00eaff]">/&gt;</span>
            </h2>
            <Link
              href="/events"
              className="text-[#00eaff] hover:text-[#00eaff]/80 font-mono flex items-center"
              prefetch={true}
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <TerminalEvents />
        </div>
      </section>
    </main>
  )
}
