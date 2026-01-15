"use client"

import { LoginScreen } from "@/components/login-screen"
import { StaffDashboard } from "@/components/staff-dashboard"
import { CustomerView } from "@/components/customer-view"
import { useCafeStore } from "@/lib/cafe-store"

export default function Home() {
  const userRole = useCafeStore((state) => state.userRole)

  if (!userRole) {
    return <LoginScreen />
  }

  if (userRole === "staff") {
    return <StaffDashboard />
  }

  return <CustomerView />
}
