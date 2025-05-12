"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/event-card"

// Sample event data
const allEvents = [
  {
    id: 1,
    title: "Meet up",
    description: "AMA Session with Learning Team",
    location: "42AD Makerspace",
    date: "May 14, 2025",
    time: "2:00 PM",
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
    time: "9:00 AM",
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
    time: "10:00 AM",
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
    time: "3:00 PM",
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
    time: "9:30 AM",
    color: "#ff2c2c", // Red
    duration: "2d",
    countdown: "in 30 days",
    category: "Conference",
    image: "/placeholder.svg?height=400&width=800",
  },
]

const categories = ["All", "Meet up", "Hackathon", "Piscine", "Workshop", "Conference"]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter events based on search term and category
  const filteredEvents = allEvents.filter(
    (event) =>
      (selectedCategory === "All" || event.category === selectedCategory) &&
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-16 px-4">
      <div className="container-left-aligned">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
            <span className="text-[#00eaff]">&lt;</span> All Events <span className="text-[#00eaff]">/&gt;</span>
          </h1>
          <p className="text-[#999999] mb-8">Discover and join upcoming tech events at 42 Abu Dhabi</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#252525] border-[#333333] text-[#f5f5f5]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-mono"
                      : "border-[#333333] text-[#f5f5f5] hover:bg-[#252525] font-mono"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#252525] border border-[#333333] rounded-md">
              <Filter className="h-12 w-12 mx-auto text-[#666666] mb-4" />
              <h3 className="text-xl font-bold font-mono text-white mb-2">No events found</h3>
              <p className="text-[#999999]">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
