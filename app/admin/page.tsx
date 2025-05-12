"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, FileUp, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminEventCard from "@/components/admin-event-card"
import AdminEventForm from "@/components/admin-event-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { useNotification } from "@/components/notification-provider"
import { useToast } from "@/hooks/use-toast"
import CSVImportPreview from "@/components/csv-import-preview"

// Sample event data
const initialEvents = [
  {
    id: 1,
    title: "Meet up",
    description: "AMA Session with Learning Team",
    location: "42AD Makerspace",
    date: "May 14, 2025",
    color: "#00c2c7", // Teal
    duration: "1h",
    countdown: "in 3 days",
    category: "Meet up",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 2,
    title: "Hackathon",
    description: "AI Hackathon: AI for Safe and Sustainable Energy",
    location: "42AD Campus",
    date: "May 27, 2025",
    color: "#1ed760", // Green
    duration: "24h",
    countdown: "in 16 days",
    category: "Hackathon",
    registered: true,
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 3,
    title: "Piscine",
    description: "Piscine Data Science -- Advanced Curriculum",
    location: "42 Berlin, Germany",
    date: "June 2, 2025",
    color: "#ff6b6b", // Coral
    duration: "6d",
    countdown: "in 22 days",
    category: "Piscine",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 4,
    title: "Workshop",
    description: "Web3 Development Workshop: Building on Ethereum",
    location: "Virtual Event",
    date: "May 18, 2025",
    color: "#8f00ff", // Purple
    duration: "3h",
    countdown: "in 7 days",
    category: "Workshop",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 5,
    title: "Conference",
    description: "Tech Trends 2025: Future of Computing",
    location: "Abu Dhabi National Exhibition Centre",
    date: "June 10, 2025",
    color: "#ff2c2c", // Red
    duration: "2d",
    countdown: "in 30 days",
    category: "Conference",
    image: "/placeholder.svg?height=400&width=800",
  },
]

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { addNotification } = useNotification()
  const { toast } = useToast()
  const [events, setEvents] = useState(initialEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [csvContent, setCsvContent] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user is admin
    if (user.role !== "admin") {
      router.push("/")
      toast({
        title: "Access denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      })
      return
    }

    setIsLoading(false)
  }, [user, router, toast])

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateEvent = (newEvent: any) => {
    const id = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1
    const eventWithId = {
      ...newEvent,
      id,
      image: newEvent.image || "/placeholder.svg?height=400&width=800",
    }
    setEvents([...events, eventWithId])
    setIsCreateOpen(false)

    // Show notification
    addNotification(`Event "${newEvent.title}" created successfully!`, "success")
  }

  const handleEditEvent = (updatedEvent: any) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setIsEditOpen(false)
    setCurrentEvent(null)

    // Show notification
    addNotification(`Event "${updatedEvent.title}" updated successfully!`, "info")
  }

  const handleDeleteEvent = (id: number) => {
    const eventToDelete = events.find((event) => event.id === id)
    setEvents(events.filter((event) => event.id !== id))

    // Show notification
    if (eventToDelete) {
      addNotification(`Event "${eventToDelete.title}" deleted successfully!`, "warning")
    }
  }

  const handleEditClick = (event: any) => {
    setCurrentEvent(event)
    setIsEditOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)

      // Read file content
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCsvContent(content)
      }
      reader.readAsText(file)
    }
  }

  const handleImportCSV = () => {
    // Switch to preview mode
    setIsPreviewMode(true)
  }

  const handleImportFromPreview = (validRows: any[]) => {
    try {
      const newEvents = validRows.map((row, index) => {
        return {
          id: events.length + index + 1,
          title: row.title,
          description: row.description,
          location: row.location,
          date: row.date,
          category: row.category,
          duration: row.duration,
          countdown: row.countdown || `in ${Math.floor(Math.random() * 30) + 1} days`,
          color: ["#00c2c7", "#1ed760", "#ff6b6b", "#8f00ff", "#ff2c2c"][Math.floor(Math.random() * 5)],
          image: "/placeholder.svg?height=400&width=800",
        }
      })

      setEvents([...events, ...newEvents])
      setIsImportOpen(false)
      setIsPreviewMode(false)
      setCsvContent("")
      setCsvFile(null)

      // Show notification
      addNotification(`${newEvents.length} events imported successfully!`, "success")

      toast({
        title: "CSV Import Successful",
        description: `${newEvents.length} events have been added to the system.`,
      })
    } catch (error) {
      console.error("Error importing CSV:", error)
      toast({
        title: "Import Failed",
        description: "Error importing CSV. Please check the format.",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = () => {
    const headers = ["id", "title", "description", "location", "date", "category", "duration", "countdown"]
    const csvData = [
      headers.join(","),
      ...events.map((event) => headers.map((header) => event[header as keyof typeof event]).join(",")),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "events.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show notification
    addNotification("Events exported to CSV successfully!", "info")
  }

  const handleExportCalendar = () => {
    // Generate iCalendar format
    let icsContent = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//42 Abu Dhabi//Events Calendar//EN"]

    events.forEach((event) => {
      // Parse date to get proper format for iCalendar
      const eventDate = new Date(event.date)
      const startDate = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

      // Calculate end date based on duration
      const endDate = (() => {
        const end = new Date(eventDate)
        if (event.duration.includes("h")) {
          end.setHours(end.getHours() + Number.parseInt(event.duration))
        } else if (event.duration.includes("d")) {
          end.setDate(end.getDate() + Number.parseInt(event.duration))
        } else if (event.duration.includes("m")) {
          end.setMinutes(end.getMinutes() + Number.parseInt(event.duration))
        }
        return end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      })()

      icsContent = [
        ...icsContent,
        "BEGIN:VEVENT",
        `UID:${event.id}@42abudhabi.events`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        `CATEGORIES:${event.category}`,
        "END:VEVENT",
      ]
    })

    icsContent.push("END:VCALENDAR")

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "42_events.ics"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show notification
    addNotification("Events exported to calendar format successfully!", "info")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00eaff] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[#f5f5f5] font-mono">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#252525] border border-[#333333] p-6 rounded-md"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-white">
              <span className="text-[#00eaff]">&gt;</span> Admin Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1e1e1e] border-[#333333] text-[#f5f5f5]"
                />
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-mono"
                >
                  <Plus className="h-4 w-4 mr-2" /> New Event
                </Button>
                <Button
                  onClick={() => setIsImportOpen(true)}
                  variant="outline"
                  className="border-[#333333] text-[#f5f5f5] font-mono"
                >
                  <FileUp className="h-4 w-4 mr-2" /> Import
                </Button>
                <div className="relative group">
                  <Button variant="outline" className="border-[#333333] text-[#f5f5f5] font-mono">
                    <FileDown className="h-4 w-4 mr-2" /> Export
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#333333] shadow-lg rounded-none z-10 hidden group-hover:block">
                    <button
                      onClick={handleExportCSV}
                      className="w-full text-left px-4 py-2 text-sm text-[#f5f5f5] hover:bg-[#333333]"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={handleExportCalendar}
                      className="w-full text-left px-4 py-2 text-sm text-[#f5f5f5] hover:bg-[#333333]"
                    >
                      Export as Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events list */}
          <div className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <AdminEventCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEditClick(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[#666666] font-mono">
                {searchTerm ? "No events match your search" : "No events found. Create your first event!"}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#252525] border-[#333333] text-[#f5f5f5]">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">Create New Event</DialogTitle>
          </DialogHeader>
          <AdminEventForm onSubmit={handleCreateEvent} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#252525] border-[#333333] text-[#f5f5f5]">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">Edit Event</DialogTitle>
          </DialogHeader>
          {currentEvent && (
            <AdminEventForm event={currentEvent} onSubmit={handleEditEvent} onCancel={() => setIsEditOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog
        open={isImportOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPreviewMode(false)
            setCsvContent("")
            setCsvFile(null)
          }
          setIsImportOpen(open)
        }}
      >
        <DialogContent className="bg-[#252525] border-[#333333] text-[#f5f5f5] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">
              {isPreviewMode ? "Preview Import Data" : "Import Events from CSV"}
            </DialogTitle>
          </DialogHeader>

          {isPreviewMode ? (
            <CSVImportPreview
              csvContent={csvContent}
              onImport={handleImportFromPreview}
              onCancel={() => setIsPreviewMode(false)}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#999999]">
                Upload a CSV file or paste your CSV content below. The first line should contain headers (title,
                description, location, date, category, duration, countdown).
              </p>

              <div className="border-2 border-dashed border-[#333333] rounded-md p-6 text-center">
                <input type="file" id="csv-upload" accept=".csv" onChange={handleFileChange} className="hidden" />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <FileUp className="h-8 w-8 mb-2 text-[#666666]" />
                  <span className="text-sm font-medium text-[#f5f5f5]">
                    {csvFile ? csvFile.name : "Click to upload CSV file"}
                  </span>
                  <span className="text-xs text-[#666666] mt-1">
                    {csvFile ? `${(csvFile.size / 1024).toFixed(2)} KB` : "or drag and drop"}
                  </span>
                </label>
              </div>

              <div className="text-sm text-[#999999] font-medium">Or paste CSV content:</div>
              <textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="w-full h-40 p-3 bg-[#1e1e1e] border border-[#333333] rounded-md text-[#f5f5f5] font-mono text-sm"
                placeholder="title,description,location,date,category,duration,countdown"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsImportOpen(false)}
                  className="border-[#333333] text-[#f5f5f5]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportCSV}
                  className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black"
                  disabled={!csvContent.trim()}
                >
                  Preview Import
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
