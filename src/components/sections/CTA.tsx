"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-xl bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] p-10 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold">Ready to create your next event?</h2>
              <p className="mt-2 opacity-90">Join thousands of organizers who trust our platform to manage their events.</p>
            </div>
            <div className="flex justify-end gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="bg-white text-[#468FAF] hover:bg-white/90">
                  Get Started
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-[#FF6B6B] hover:bg-white/90">
                  Contact Sales
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
