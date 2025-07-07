'use client'

import { useUser } from '@clerk/nextjs'
import OrganizerDashboard from './dashboards/OrganizerDashboard'
import { DashboardHeader } from './dashboards/DashboardHeader'
import AdminDashboard from './dashboards/AdminDashboard'


export default function Dashboard() {
  const { user } = useUser()
  
  const userRole = user?.unsafeMetadata?.role as string || 'attendee'

  const renderRoleBasedContent = () => {
    switch (userRole) {
      case 'admin':
        return (
          <AdminDashboard/>
        )
      
      case 'organizer':
        return (
          <OrganizerDashboard />
        )
      
      case 'attendee':
      default:
        return (
             <OrganizerDashboard />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderRoleBasedContent()}
        </div>
      </main>
    </div>
  )
}