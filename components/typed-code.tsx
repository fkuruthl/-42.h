"use client"

import { useState, useEffect } from "react"

interface TypedCodeProps {
  text: string
  delay?: number
  startDelay?: number
}

export default function TypedCode({ text, delay = 50, startDelay = 0 }: TypedCodeProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // Handle the initial delay before typing starts
    const startTimer = setTimeout(() => {
      setStarted(true)
    }, startDelay)

    return () => clearTimeout(startTimer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, delay)

    return () => clearInterval(typingInterval)
  }, [text, delay, started])

  return <span>{displayedText}</span>
}
