"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCafeStore, type TimeSlot, formatDate } from "@/lib/cafe-store"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableId: number
  onConfirm: (date: string, slot: TimeSlot) => void
}

export function BookingModal({ open, onOpenChange, tableId, onConfirm }: BookingModalProps) {
  const { getAvailableSlotsForTable, tables } = useCafeStore()
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0])
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string>("")

  const table = tables.find((t) => t.id === tableId)
  const availableSlots = getAvailableSlotsForTable(tableId, selectedDate)

  // Reset slot selection when date changes
  useEffect(() => {
    setSelectedSlotIndex("")
  }, [selectedDate])

  // Generate next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  const handleConfirm = () => {
    const slot = availableSlots[Number.parseInt(selectedSlotIndex)]
    if (slot) {
      onConfirm(selectedDate, slot)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{tableId}</span>
            </div>
            Book Table {tableId}
          </DialogTitle>
          <DialogDescription>{table && `Capacity: ${table.capacity} people`}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
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
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time Slot
            </Label>
            {availableSlots.length > 0 ? (
              <Select value={selectedSlotIndex} onValueChange={setSelectedSlotIndex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availableSlots.map((slot, index) => (
                    <SelectItem key={slot.start} value={index.toString()}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 rounded-lg bg-muted text-muted-foreground text-sm text-center">
                No available slots for this date
              </div>
            )}
          </div>

          {/* Selected Summary */}
          {selectedSlotIndex !== "" && availableSlots[Number.parseInt(selectedSlotIndex)] && (
            <div className="p-3 rounded-lg bg-status-free/10 border border-status-free/30">
              <p className="text-sm font-medium text-foreground">Booking Summary</p>
              <p className="text-sm text-muted-foreground">
                Table {tableId} on {formatDate(selectedDate)} at{" "}
                {availableSlots[Number.parseInt(selectedSlotIndex)].label}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-status-free hover:bg-status-free/90"
            disabled={selectedSlotIndex === "" || availableSlots.length === 0}
            onClick={handleConfirm}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
