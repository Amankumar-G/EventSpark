"use client"

import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { FeaturedEvents } from "@/components/sections/FeaturedEvents"
import { CTA } from "@/components/sections/CTA"
import { Footer } from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="bg-white min-h-screen">
      <Header />
      <Hero />
      <FeaturedEvents />
      <CTA />
      <Footer />
    </motion.div>
  )
}
