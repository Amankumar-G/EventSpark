"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function FeaturedEvents() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Upcoming <span className="text-[#FF6B6B]">Featured</span> Events
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Discover what's happening in your community
        </p>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              whileHover={{ y: -5 }}
            >
              <Card className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] rounded-lg" />
                </CardHeader>
                <CardContent>
                  <CardTitle>Community Tech Conference</CardTitle>
                  <CardDescription className="mt-2">
                    Join us for a day of innovation and networking with industry leaders.
                  </CardDescription>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-[#468FAF]">July 15, 2025</span>
                    <Button variant="link" className="text-[#FF6B6B] p-0 h-auto">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12">
          <Button className="bg-[#FF6B6B] hover:bg-[#e55f5f] text-white">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  )
}
