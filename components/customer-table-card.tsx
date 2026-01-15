"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { useCafeStore, type Table, type TableStatus } from "@/lib/cafe-store"

interface CustomerTableCardProps {
  table: Table
  onBook: (tableId: number) => void
}

const statusConfig: Record<TableStatus, { label: string; emoji: string; bgClass: string; badgeClass: string }> = {
  free: {
    label: "Free",
    emoji: "",
    bgClass: "bg-status-free/10 border-status-free/30",
    badgeClass: "bg-status-free text-white",
  },
  occupied: {
    label: "Occupied",
    emoji: "",
    bgClass: "bg-status-occupied/10 border-status-occupied/30 opacity-70",
    badgeClass: "bg-status-occupied text-white",
  },
  reserved: {
    label: "Reserved",
    emoji: "",
    bgClass: "bg-status-reserved/10 border-status-reserved/30 opacity-70",
    badgeClass: "bg-status-reserved text-foreground",
  },
}

export function CustomerTableCard({ table, onBook }: CustomerTableCardProps) {
  const { selectedDate, selectedSlot, getTableStatusForSlot, getAvailableSlotsForTable } = useCafeStore()

  const status = selectedSlot ? getTableStatusForSlot(table.id, selectedDate, selectedSlot) : "free"

  const config = statusConfig[status]
  const isFree = status === "free"
  const availableSlots = getAvailableSlotsForTable(table.id, selectedDate)

  return (
    <Card
      className={cn(
        "transition-all duration-200 border-2",
        config.bgClass,
        isFree && "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
      )}
      onClick={isFree ? () => onBook(table.id) : undefined}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3 min-h-[160px]">
        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm">
          <span className="text-xl font-bold text-foreground">{table.id}</span>
        </div>
        <Badge className={cn("px-3 py-1 text-sm font-medium", config.badgeClass)}>{config.label}</Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          {table.capacity} seats
        </div>
        {isFree ? (
          <Button
            size="sm"
            className="w-full bg-status-free hover:bg-status-free/90 text-white"
            onClick={(e) => {
              e.stopPropagation()
              onBook(table.id)
            }}
          >
            Book Now
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            {availableSlots.length > 0 ? `${availableSlots.length} slots available` : "Fully booked today"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
