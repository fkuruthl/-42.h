"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotification } from "@/components/notification-provider"
import { useEventRegistration } from "@/hooks/use-event-registration"

// Sample event data
const events = [
  {
    id: 1,
    title: "Meet up",
    date: "May 14, 2025",
    time: "2:00 PM",
    location: "42AD Makerspace",
    description:
      "Join us for an AMA session with the Learning Team. Get answers to your questions about the curriculum, learning resources, and upcoming educational initiatives.\n\nThis is a great opportunity to connect with the team that designs and maintains the learning experience at 42 Abu Dhabi. Whether you're a new student or have been with us for a while, this session will provide valuable insights into how to make the most of your educational journey.\n\nRefreshments will be provided, and there will be time for networking after the formal Q&A session.",
    image: "/placeholder.svg?height=400&width=800",
    organizer: "42 Abu Dhabi Learning Team",
    capacity: "50 participants",
    category: "Meet up",
    color: "#00c2c7", // Teal
    tags: ["Education", "Networking", "Q&A"],
    duration: "1h",
    countdown: "in 3 days",
  },
  {
    id: 2,
    title: "Hackathon",
    date: "May 27, 2025",
    time: "9:00 AM",
    location: "42AD Campus",
    description:
      "Join us for a 24-hour coding marathon focused on AI solutions for sustainable energy. This hackathon challenges participants to develop innovative applications that address energy efficiency, renewable energy integration, or smart grid technologies.\n\nTeams of 2-4 people will work together to create prototypes that demonstrate the potential of AI in transforming our energy systems. Industry experts will be available as mentors throughout the event, providing guidance and feedback.\n\nPrizes include cash awards, internship opportunities with leading energy companies, and the chance to further develop your solution with industry support.",
    image: "/placeholder.svg?height=400&width=800",
    organizer: "42 Abu Dhabi Tech Club",
    capacity: "100 participants",
    category: "Hackathon",
    color: "#1ed760", // Green
    tags: ["AI", "Sustainability", "Energy", "Coding"],
    duration: "24h",
    countdown: "in 16 days",
  },
  {
    id: 3,
    title: "Piscine",
    date: "June 2, 2025",
    time: "10:00 AM",
    location: "42 Berlin, Germany",
    description:
      "Experience an intensive 6-day immersion in advanced data science concepts and practices. This piscine is designed for students who have already completed the core curriculum and want to specialize in data science.\n\nThe program covers machine learning algorithms, deep learning frameworks, data visualization, and big data processing. Each day includes theoretical sessions followed by practical exercises and projects that reinforce the concepts learned.\n\nThis is a collaborative learning experience where participants will work together to solve complex data challenges. The piscine concludes with a final project that integrates all the skills acquired during the week.",
    image: "/placeholder.svg?height=400&width=800",
    organizer: "42 Network Data Science Team",
    capacity: "30 participants",
    category: "Piscine",
    color: "#ff6b6b", // Coral
    tags: ["Data Science", "Machine Learning", "Intensive"],
    duration: "6d",
    countdown: "in 22 days",
  },
  {
    id: 4,
    title: "Workshop",
    date: "May 18, 2025",
    time: "3:00 PM",
    location: "Virtual Event",
    description:
      "Learn the fundamentals of Web3 development in this hands-on workshop focused on building decentralized applications (dApps) on the Ethereum blockchain.\n\nThis workshop will cover smart contract development with Solidity, integrating with front-end applications using ethers.js, and deploying to test networks. Participants will build a simple dApp from scratch and learn best practices for security and optimization.\n\nPrior experience with JavaScript and basic understanding of blockchain concepts is recommended. All participants will receive access to additional learning resources and a certificate of completion.",
    image: "/placeholder.svg?height=400&width=800",
    organizer: "Web3 Community",
    capacity: "75 participants",
    category: "Workshop",
    color: "#8f00ff", // Purple
    tags: ["Web3", "Blockchain", "Ethereum", "Development"],
    duration: "3h",
    countdown: "in 7 days",
  },
  {
    id: 5,
    title: "Conference",
    date: "June 10, 2025",
    time: "9:30 AM",
    location: "Abu Dhabi National Exhibition Centre",
    description:
      "Join us for a two-day conference exploring the cutting-edge trends that will shape the future of computing. Industry leaders, researchers, and innovators will share insights on quantum computing, artificial intelligence, extended reality, and more.\n\nThe conference features keynote presentations, panel discussions, interactive demos, and networking opportunities. Attendees will gain a deeper understanding of how emerging technologies are transforming industries and creating new possibilities.\n\nExhibition booths will showcase the latest products and services from technology companies. This is an excellent opportunity to connect with potential employers, partners, and collaborators in the tech ecosystem.",
    image: "/placeholder.svg?height=400&width=800",
    organizer: "Tech Innovation Forum",
    capacity: "500 participants",
    category: "Conference",
    color: "#ff2c2c", // Red
    tags: ["Future Tech", "Innovation", "Networking"],
    duration: "2d",
    countdown: "in 30 days",
  },
]

export default function EventDetail({ params }: { params: { id: string } }) {
  const eventId = Number.parseInt(params.id)
  const event = events.find((e) => e.id === eventId)
  const [scrollY, setScrollY] = useState(0)
  const { isLoaded, isEventRegistered, registerEvent } = useEventRegistration()
  const [isRegistered, setIsRegistered] = useState(false)
  const { addNotification } = useNotification()

  useEffect(() => {
    if (isLoaded) {
      setIsRegistered(isEventRegistered(eventId))
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isLoaded, isEventRegistered, eventId])

  const handleRegister = () => {
    setIsRegistered(true)

    // Update localStorage
    registerEvent(eventId)

    // Show notification
    addNotification(`You've registered for "${event?.title}"!`, "success")
  }

  if (!event) {
    return (
      <div className="container mx-auto max-w-6xl py-32 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold font-mono mb-4 text-white">Event Not Found</h1>
          <p className="text-[#f5f5f5] mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events" prefetch={true}>
            <Button className="bg-[#ff2c2c] hover:bg-[#ff2c2c]/80 text-white font-mono">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="pt-24 pb-16 px-4 bg-[#1a1a1a] text-[#f5f5f5]">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/events"
            className="inline-flex items-center text-[#00eaff] hover:text-[#00eaff]/80 font-mono mb-8"
            prefetch={true}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#252525] border border-[#333333] overflow-hidden"
        >
          <div className="relative h-64 md:h-96">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
                filter: "grayscale(30%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${event.color}40 100%)`,
              }}
            ></div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: event.color }}></div>

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: event.color,
                  color: "white",
                }}
              >
                {event.category}
              </Badge>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold font-mono text-white"
              >
                {event.title}
              </motion.h1>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#333333] pb-8">
              <div className="flex items-center text-[#f5f5f5]">
                <Calendar className="h-5 w-5 mr-3" style={{ color: event.color }} />
                <span>{event.date}</span>
              </div>

              <div className="flex items-center text-[#f5f5f5]">
                <Clock className="h-5 w-5 mr-3" style={{ color: event.color }} />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center text-[#f5f5f5]">
                <MapPin className="h-5 w-5 mr-3" style={{ color: event.color }} />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center text-[#f5f5f5]">
                <Users className="h-5 w-5 mr-3" style={{ color: event.color }} />
                <span>{event.capacity}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-mono mb-4 text-white">About This Event</h2>
              <div className="text-[#f5f5f5] space-y-4">
                {event.description.split("\n\n").map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            <div className="border-t border-[#333333] pt-6">
              <h2 className="text-xl font-bold font-mono mb-4 text-white">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-[#333333] text-[#f5f5f5]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-[#333333] pt-6">
              <h2 className="text-xl font-bold font-mono mb-4 text-white">Organizer</h2>
              <p className="text-[#f5f5f5]">{event.organizer}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              {isRegistered ? (
                <Button size="lg" className="font-mono text-white bg-[#1ed760]" disabled>
                  ✓ Registered
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="font-mono text-white"
                  style={{ backgroundColor: event.color }}
                  onClick={handleRegister}
                >
                  Register Now
                </Button>
              )}
              <Button variant="outline" size="lg" className="font-mono border-[#333333] text-[#f5f5f5]">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
