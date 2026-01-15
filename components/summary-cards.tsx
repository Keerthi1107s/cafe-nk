"use client"

import { Users, CheckCircle, XCircle, Clock, CalendarClock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useCafeStore } from "@/lib/cafe-store"

export function SummaryCards() {
  const {
    tables,
    selectedDate,
    selectedSlot,
    getFreeTablesForSlot,
    getOccupiedTablesForSlot,
    getReservedTablesForSlot,
    getEstimatedWaitTime,
    getTotalBookingsToday,
  } = useCafeStore()

  const freeTables = selectedSlot ? getFreeTablesForSlot(selectedDate, selectedSlot) : 0
  const occupiedTables = selectedSlot ? getOccupiedTablesForSlot(selectedDate, selectedSlot) : 0
  const reservedTables = selectedSlot ? getReservedTablesForSlot(selectedDate, selectedSlot) : 0
  const waitTime = selectedSlot ? getEstimatedWaitTime(selectedDate, selectedSlot) : 0

  const stats = [
    {
      label: "Total Tables",
      value: tables.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Free",
      value: freeTables,
      icon: CheckCircle,
      color: "text-status-free",
      bg: "bg-status-free/10",
    },
    {
      label: "Occupied",
      value: occupiedTables,
      icon: XCircle,
      color: "text-status-occupied",
      bg: "bg-status-occupied/10",
    },
    {
      label: "Reserved",
      value: reservedTables,
      icon: Clock,
      color: "text-status-reserved",
      bg: "bg-status-reserved/10",
    },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Bookings and Wait Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border border-border/50 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <CalendarClock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Today's Reservations</p>
              <p className="text-2xl font-bold text-primary">{getTotalBookingsToday()}</p>
            </div>
          </CardContent>
        </Card>

        {freeTables === 0 && (
          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Estimated Wait Time</p>
                <p className="text-2xl font-bold text-accent">{waitTime} minutes</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
