"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  username: string
  role: "admin" | "student"
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Protect admin routes
  useEffect(() => {
    if (isLoading) return

    const isAdminRoute = pathname?.startsWith("/admin")

    if (isAdminRoute && !user) {
      router.push("/login")
      toast({
        title: "Access denied",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive",
      })
    }
  }, [pathname, user, isLoading, router, toast])

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    if (username === "admin" && password === "admin123") {
      const newUser = { username, role: "admin" as const }

      // Update state
      setUser(newUser)

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(newUser))

      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
