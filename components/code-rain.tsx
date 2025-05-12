"use client"

import { useEffect, useRef } from "react"

export default function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Characters to display
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const charArray = chars.split("")

    // Columns setup
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Drops - one per column, with random starting y positions
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // Colors for different characters
    const colors = ["#ff2c2c", "#00eaff", "#8f00ff", "#ffffff"]

    // Drawing the characters
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      ctx.fillStyle = "rgba(26, 26, 26, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)]

        // Random color from our palette
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]

        // Draw the character
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Increment y coordinate for next drop
        drops[i]++

        // Reset drop position with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
          drops[i] = 0
        }
      }
    }

    // Animation loop
    const interval = setInterval(draw, 35)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" style={{ pointerEvents: "none" }} />
}
