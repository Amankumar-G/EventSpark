'use client'

import { useRoleAuth } from '@/features/auth/hooks/useRoleAuth'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: string
  fallback?: React.ReactNode
}

export default function RoleGuard({ 
  children, 
  requiredRole, 
  fallback = <div>Access denied. Insufficient permissions.</div> 
}: RoleGuardProps) {
  const { hasRequiredRole, isLoaded } = useRoleAuth(requiredRole)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div
          className="flex space-x-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={cn(
                'block w-3 h-3 rounded-full',
                // you can swap these with your theme colors:
                'bg-primary'
              )}
              variants={{
                hidden: { y: 0 },
                visible: { y: [0, -8, 0] },
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    )
  }

  if (!hasRequiredRole) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
