"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
  ]

  // Add admin link if user is admin
  if (isAdmin) {
    navLinks.push({ name: "Admin", href: "/admin" })
  } else {
    navLinks.push({ name: "Admin", href: "/login" })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAdminClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAdmin) {
      // If already admin, let the link work normally
      return
    }

    // If not admin, prevent default and redirect to login
    e.preventDefault()
    router.push("/login")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#1a1a1a]/90 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="mb-4">
            <motion.div
              className="text-3xl md:text-4xl font-bold font-mono text-white flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[#ff2c2c]">#42</span>
              <span className="text-[#00eaff]">_</span>
              <span className="text-[#8f00ff]">Events</span>
              <span className="text-[#00eaff]">.h</span>
            </motion.div>
          </Link>

          {/* Navigation - Always visible */}
          <nav className="flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.name === "Admin" ? handleAdminClick : undefined}
                className={`text-[#f5f5f5] hover:text-white font-mono relative group ${
                  pathname === link.href ? "text-white" : ""
                }`}
                prefetch={true}
              >
                {link.name}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-[#00eaff] transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}

            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={logout} className="text-[#f5f5f5] hover:text-[#ff6b6b]">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
