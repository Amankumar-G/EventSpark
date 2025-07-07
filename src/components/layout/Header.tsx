"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          {/* <Calendar className="h-6 w-6 text-[#468FAF]" /> */}
          <span className="font-bold text-gray-900 text-lg">Eventify</span>
        </motion.div>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/sign-in"
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-[#FF6B6B] transition-colors"
                >
                  Sign In
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/sign-up"
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-[#FF6B6B] transition-colors"
                >
                  Sign Up
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="outline"
                className="bg-[#468FAF] text-white hover:bg-[#3a7a99] ml-2"
              >
                View Events
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
