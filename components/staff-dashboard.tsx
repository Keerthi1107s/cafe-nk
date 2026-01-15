"use client"

import { useState } from "react"
import { Header } from "./header"
import { SummaryCards } from "./summary-cards"
import { TablesGrid } from "./tables-grid"
import { TimeSlotSelector } from "./time-slot-selector"
import { UpcomingReservations } from "./upcoming-reservations"
import { AnalyticsScreen } from "./analytics-screen"

export function StaffDashboard() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header
        showAnalytics
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        analyticsActive={showAnalytics}
      />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {showAnalytics ? (
          <AnalyticsScreen />
        ) : (
          <>
            <TimeSlotSelector />

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Table Overview</h2>
              <p className="text-sm text-muted-foreground">
                View table status for the selected time slot. Click to cycle: Free → Occupied → Reserved
              </p>
            </div>

            <SummaryCards />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TablesGrid interactive />
              </div>
              <div>
                <UpcomingReservations />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
