"use client"

import { CalendarClock, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCafeStore, TIME_SLOTS, formatDate, isSlotInPast } from "@/lib/cafe-store"

export function UpcomingReservations() {
  const { bookings, cancelBooking, selectedDate } = useCafeStore()

  // Get future bookings sorted by date and time
  const futureBookings = bookings
    .filter((b) => !isSlotInPast(b.date, b.slotStart))
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.slotStart.localeCompare(b.slotStart)
    })
    .slice(0, 10)

  const getSlotLabel = (slotStart: string) => {
    const slot = TIME_SLOTS.find((s) => s.start === slotStart)
    return slot?.label || slotStart
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary" />
          Upcoming Reservations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {futureBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming reservations</p>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-2">
              {futureBookings.map((booking, index) => (
                <div
                  key={`${booking.tableId}-${booking.date}-${booking.slotStart}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{booking.tableId}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Table {booking.tableId}</p>
                      <p className="text-xs text-muted-foreground">{getSlotLabel(booking.slotStart)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {booking.date === selectedDate ? "Today" : formatDate(booking.date)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => cancelBooking(booking.tableId, booking.date, booking.slotStart)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
