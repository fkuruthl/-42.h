"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Linkedin, Mail, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#151515] border-t border-[#333333] py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold font-mono mb-4 text-white">
              <span className="text-[#ff2c2c]">42</span>
              <span className="text-[#00eaff]">_</span>
              <span className="text-[#8f00ff]">Events</span>
            </h3>
            <p className="text-[#f5f5f5] mb-4">
              Connecting tech enthusiasts through innovative events and collaborative experiences.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: <Linkedin className="h-5 w-5" />,
                  href: "https://www.linkedin.com/school/42abudhabi/posts/?feedView=all",
                  color: "#00eaff",
                },
                {
                  icon: <Instagram className="h-5 w-5" />,
                  href: "https://www.instagram.com/42abudhabi/",
                  color: "#ff2c2c",
                },
              ].map((social, index) => (
                <motion.div key={index} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#252525] text-[#f5f5f5] hover:text-white transition-colors"
                    style={{ color: social.color }}
                  >
                    {social.icon}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-mono mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-[#f5f5f5]">
                <Mail className="h-4 w-4 mr-2 text-[#8f00ff]" />
                <span>contact@42abudhabi.events</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-8 pt-8 text-center text-[#f5f5f5] text-sm">
          <p>© {currentYear} 42 Abu Dhabi Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
