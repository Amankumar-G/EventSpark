'use client'

import { SignUp } from '@clerk/nextjs'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function CustomSignUp() {
  const [selectedRole, setSelectedRole] = useState<string>('attendee')
  const roleOptions = [
    { 
      role: 'attendee', 
      title: 'Event Attendee', 
      description: 'Discover and attend exciting events',
      icon: '🎟️'
    },
    { 
      role: 'organizer', 
      title: 'Event Organizer', 
      description: 'Create and manage your own events',
      icon: '📅'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Branding and Role Selection */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col"
          >

            <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-white">
              <div className="h-2 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B]"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Join Our Community
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select how you'd like to participate
                </CardDescription>
              </CardHeader>
              <CardContent>
                  {roleOptions.map(({ role, title, description, icon }) => (
                    <motion.div 
                      key={role}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedRole === role 
                            ? 'border-[#468FAF] bg-[#468FAF]/5 shadow-[0_0_0_1px_#468FAF]' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setSelectedRole(role)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl mt-0.5">{icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <Label htmlFor={role} className="text-base font-medium text-gray-800">
                                {title}
                              </Label>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 ml-6">{description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}


              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Right Panel - Sign Up Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <div className="w-full max-w-md p-6">
              <SignUp
                routing="hash"
                unsafeMetadata={{
                  role: selectedRole,
                }}
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-[#468FAF] hover:bg-[#3b7ca0] text-white',
                    card: 'shadow-none',
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}