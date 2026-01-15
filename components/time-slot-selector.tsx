"use client"

import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCafeStore, TIME_SLOTS, formatDate, isSlotInPast } from "@/lib/cafe-store"

export function TimeSlotSelector() {
  const { selectedDate, selectedSlot, setSelectedDate, setSelectedSlot } = useCafeStore()

  // Generate next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  // Filter slots: for today, only show future slots
  const availableSlots = TIME_SLOTS.filter((slot) => !isSlotInPast(selectedDate, slot.start))

  const selectedSlotIndex = selectedSlot ? TIME_SLOTS.findIndex((s) => s.start === selectedSlot.start).toString() : ""

  return (
    <Card className="border border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Selection */}
          <div className="flex-1 space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                    {date === new Date().toISOString().split("T")[0] && " (Today)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Selection */}
          <div className="flex-1 space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Time Slot
            </Label>
            <Select value={selectedSlotIndex} onValueChange={(v) => setSelectedSlot(TIME_SLOTS[Number.parseInt(v)])}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {TIME_SLOTS.map((slot, index) => {
                  const isPast = isSlotInPast(selectedDate, slot.start)
                  return (
                    <SelectItem key={slot.start} value={index.toString()} disabled={isPast}>
                      {slot.label} {isPast && "(Past)"}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
