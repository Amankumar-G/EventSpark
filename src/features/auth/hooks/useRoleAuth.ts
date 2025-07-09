import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useRoleAuth = (requiredRole?: string) => {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  const userRole = user?.unsafeMetadata?.role as string || 'attendee'

  const hasRequiredRole = requiredRole ? userRole === requiredRole : true
  return {
    user,
    userRole,
    hasRequiredRole,
    isLoaded
  }
}