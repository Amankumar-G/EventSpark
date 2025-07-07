'use client'

import { useRoleAuth } from '@/hooks/useRoleAuth'

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
    return <div>Loading...</div>
  }

  if (!hasRequiredRole) {
    return <>{fallback}</>
  }

  return <>{children}</>
}