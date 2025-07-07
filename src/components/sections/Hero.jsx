"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"


export function Hero() {
  const [selectedDates, setSelectedDates] = useState([])
  
    useEffect(() => {
      setSelectedDates([
        new Date(2025, 6, 1),
        new Date(2025, 6, 3),
        new Date(2025, 6, 8),
        new Date(2025, 6, 10),
        new Date(2025, 6, 15),
        new Date(2025, 6, 18),
        new Date(2025, 6, 22),
        new Date(2025, 6, 25),
        new Date(2025, 6, 30),
      ])
  }, [])

   if (!selectedDates) return null 
  return (
    <section className="container mx-auto py-20 px-4 grid gap-12 lg:grid-cols-2 items-center">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Organize & Discover{" "}
          <span className="text-[#FF6B6B]">Events</span> That Matter
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Connect with your community through unforgettable experiences. Whether you're hosting or attending, we make event management seamless.
        </p>
        <div className="mt-8 flex gap-4">
          <Button className="bg-[#468FAF] hover:bg-[#3a7a99] text-white">
            Create Event
          </Button>
          <Button variant="outline" className="border-[#468FAF] text-[#468FAF] hover:bg-[#468FAF]/10">
            Learn More
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center"
      >
        <Calendar
          mode="multiple"
           selected={selectedDates}
          className="rounded-md border shadow-md"
        />
      </motion.div>
    </section>
  )
}
