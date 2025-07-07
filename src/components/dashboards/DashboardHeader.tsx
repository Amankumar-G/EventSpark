'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

export function DashboardHeader() {
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || 'attendee'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-bold text-gray-900">
            Eventify
          </Link>
        </motion.div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-3">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Role: <span className="capitalize text-black">{userRole}</span>
                </span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/events"
                  className="text-sm px-3 py-1.5 hover:text-[#468FAF] transition-colors"
                >
                  Browse Events
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <UserButton afterSignOutUrl="/" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
