"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  color: string
  duration: string
  countdown: string
  category: string
  registered?: boolean
}

interface AdminEventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
}

export default function AdminEventCard({ event, onEdit, onDelete }: AdminEventCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e1e1e] border border-[#333333] rounded-md overflow-hidden"
    >
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        {/* Color indicator */}
        <div
          className="w-full sm:w-2 h-2 sm:h-auto rounded-full sm:rounded-none flex-shrink-0"
          style={{ backgroundColor: event.color }}
        ></div>

        {/* Event details */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-mono text-white">{event.title}</h3>
              <Badge
                className="text-xs"
                style={{
                  backgroundColor: event.color,
                  color: "white",
                }}
              >
                {event.category}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 text-[#f5f5f5] hover:text-white hover:bg-[#333333]"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="h-8 w-8 text-[#f5f5f5] hover:text-[#ff6b6b] hover:bg-[#333333]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-[#999999] text-sm mb-3 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#f5f5f5]">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" style={{ color: event.color }} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" style={{ color: event.color }} />
              <span>{event.duration}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" style={{ color: event.color }} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#252525] border-[#333333] text-[#f5f5f5]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#333333] text-[#f5f5f5] hover:bg-[#333333] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/80 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
