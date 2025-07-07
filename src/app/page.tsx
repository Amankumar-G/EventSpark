"use client";

import { Hero } from "@/components/sections/Hero";
import { FeaturedEvents } from "@/components/sections/FeaturedEvents";
import { CTA } from "@/components/sections/CTA";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white"
    >
      <Hero />
      <FeaturedEvents />
      <CTA />
    </motion.div>
  );
}
