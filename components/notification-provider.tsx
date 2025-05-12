"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "success" | "info" | "warning" | "error"
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type?: "success" | "info" | "warning" | "error") => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
})

export const useNotification = () => useContext(NotificationContext)

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        setNotifications((prev) => prev.slice(1))
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [notifications])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 left-4 z-50 space-y-2 max-w-xs">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`p-3 rounded-md shadow-lg border flex items-start gap-2 ${
                notification.type === "success"
                  ? "bg-[#1e1e1e] border-[#1ed760] text-[#1ed760]"
                  : notification.type === "error"
                    ? "bg-[#1e1e1e] border-[#ff6b6b] text-[#ff6b6b]"
                    : notification.type === "warning"
                      ? "bg-[#1e1e1e] border-[#ffbd2e] text-[#ffbd2e]"
                      : "bg-[#1e1e1e] border-[#00eaff] text-[#00eaff]"
              }`}
            >
              <div className="flex-grow font-mono text-sm">{notification.message}</div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-[#666666] hover:text-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
