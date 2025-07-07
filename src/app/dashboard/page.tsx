"use client";

import { useRoleAuth } from "@/features/auth/hooks/useRoleAuth";
import RoleGuard from "@/features/auth/RoleGuard";
import AdminDashboard from "@/features/dashboards/AdminDashboard";
import OrganizerDashboard from "@/features/dashboards/OrganizerDashboard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { isLoaded } = useRoleAuth(); // no requiredRole here

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SingleLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <RoleGuard requiredRole="admin">
            <AdminDashboard />
          </RoleGuard>
          <RoleGuard requiredRole="organizer">
            <OrganizerDashboard />
          </RoleGuard>
          {/* etc */}
        </div>
      </main>
    </div>
  );
}

function SingleLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
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
            className={cn("block w-3 h-3 rounded-full", "bg-primary")}
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
  );
}
