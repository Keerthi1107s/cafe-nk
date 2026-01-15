"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CalendarClock } from "lucide-react"
import { useCafeStore, type Table, type TableStatus } from "@/lib/cafe-store"

interface TableCardProps {
  table: Table
  onClick?: () => void
  interactive?: boolean
}

const statusConfig: Record<TableStatus, { label: string; bgClass: string; badgeClass: string }> = {
  free: {
    label: "Free",
    bgClass: "bg-status-free/10 hover:bg-status-free/20 border-status-free/30",
    badgeClass: "bg-status-free text-white",
  },
  occupied: {
    label: "Occupied",
    bgClass: "bg-status-occupied/10 hover:bg-status-occupied/20 border-status-occupied/30",
    badgeClass: "bg-status-occupied text-white",
  },
  reserved: {
    label: "Reserved",
    bgClass: "bg-status-reserved/10 hover:bg-status-reserved/20 border-status-reserved/30",
    badgeClass: "bg-status-reserved text-foreground",
  },
}

export function TableCard({ table, onClick, interactive = false }: TableCardProps) {
  const { selectedDate, selectedSlot, getTableStatusForSlot, getBookingsForTable } = useCafeStore()

  const status = selectedSlot ? getTableStatusForSlot(table.id, selectedDate, selectedSlot) : "free"
  const config = statusConfig[status]

  // Get upcoming bookings count for this table today
  const todayBookings = getBookingsForTable(table.id).filter((b) => b.date === selectedDate)

  return (
    <Card
      onClick={onClick}
      className={cn(
        "transition-all duration-200 border-2",
        config.bgClass,
        interactive && "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
      )}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3 min-h-[140px]">
        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm">
          <span className="text-xl font-bold text-foreground">{table.id}</span>
        </div>
        <Badge className={cn("px-3 py-1 text-sm font-medium", config.badgeClass)}>{config.label}</Badge>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {table.capacity}
          </span>
          {todayBookings.length > 0 && (
            <span className="flex items-center gap-1">
              <CalendarClock className="w-3 h-3" />
              {todayBookings.length} bookings
            </span>
          )}
        </div>
        {interactive && <p className="text-xs text-muted-foreground">Click to change</p>}
      </CardContent>
    </Card>
  )
}
