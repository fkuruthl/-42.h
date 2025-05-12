"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPin } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Event {
  id?: number
  title: string
  description: string
  location: string
  date: string
  color: string
  duration: string
  countdown: string
  category: string
}

interface AdminEventFormProps {
  event?: Event
  onSubmit: (event: Event) => void
  onCancel: () => void
}

export default function AdminEventForm({ event, onSubmit, onCancel }: AdminEventFormProps) {
  const [formData, setFormData] = useState<Event>(
    event || {
      title: "",
      description: "",
      location: "",
      date: "",
      color: "#00c2c7",
      duration: "1h",
      countdown: "",
      category: "",
    },
  )

  const [date, setDate] = useState<Date | undefined>(event?.date ? new Date(event.date) : undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMMM d, yyyy")
      setFormData((prev) => ({ ...prev, date: formattedDate }))

      // Calculate countdown
      const today = new Date()
      const diffTime = selectedDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setFormData((prev) => ({ ...prev, countdown: `in ${diffDays} days` }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const colorOptions = [
    { value: "#00c2c7", label: "Teal" },
    { value: "#1ed760", label: "Green" },
    { value: "#ff6b6b", label: "Coral" },
    { value: "#8f00ff", label: "Purple" },
    { value: "#ff2c2c", label: "Red" },
    { value: "#00eaff", label: "Blue" },
  ]

  const durationOptions = ["30m", "1h", "2h", "3h", "4h", "6h", "12h", "24h", "2d", "3d", "5d", "7d"]

  const categoryOptions = ["Meet up", "Hackathon", "Workshop", "Piscine", "Conference", "Competition"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          required
          className="bg-[#1e1e1e] border-[#333333] text-[#f5f5f5]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          required
          className="bg-[#1e1e1e] border-[#333333] text-[#f5f5f5] min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full h-10 px-3 py-2 bg-[#1e1e1e] border border-[#333333] rounded-none text-[#f5f5f5] text-sm"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color.value ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#1e1e1e] border-[#333333] text-[#f5f5f5]",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#252525] border-[#333333]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="bg-[#252525] text-[#f5f5f5]"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
            className="w-full h-10 px-3 py-2 bg-[#1e1e1e] border border-[#333333] rounded-none text-[#f5f5f5] text-sm"
            required
          >
            {durationOptions.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
            className="pl-10 bg-[#1e1e1e] border-[#333333] text-[#f5f5f5]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#333333] text-[#f5f5f5]">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black">
          {event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
