"use client"

import { useState } from "react"
import { Clock, CheckCircle, Users, UtensilsCrossed, CalendarCheck } from "lucide-react"
import { Header } from "./header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TablesGrid } from "./tables-grid"
import { TimeSlotSelector } from "./time-slot-selector"
import { BookingModal } from "./booking-modal"
import { MenuSection } from "./menu-section"
import { useCafeStore, type TimeSlot } from "@/lib/cafe-store"
import { useToast } from "@/hooks/use-toast"

export function CustomerView() {
  const {
    selectedDate,
    selectedSlot,
    getFreeTablesForSlot,
    getOccupiedTablesForSlot,
    getEstimatedWaitTime,
    addBooking,
  } = useCafeStore()
  const { toast } = useToast()
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)

  const freeTables = selectedSlot ? getFreeTablesForSlot(selectedDate, selectedSlot) : 0
  const waitTime = selectedSlot ? getEstimatedWaitTime(selectedDate, selectedSlot) : 0
  const waitingCount = selectedSlot ? getOccupiedTablesForSlot(selectedDate, selectedSlot) : 0

  const handleOpenBookingModal = (tableId: number) => {
    setSelectedTableId(tableId)
    setBookingModalOpen(true)
  }

  const handleConfirmBooking = (date: string, slot: TimeSlot) => {
    if (selectedTableId === null) return

    const success = addBooking(selectedTableId, date, slot)
    if (success) {
      toast({
        title: "Table booked successfully!",
        description: `Table ${selectedTableId} booked for ${slot.label}`,
      })
    } else {
      toast({
        title: "Booking failed",
        description: "This slot may have just been booked. Please try another.",
        variant: "destructive",
      })
    }
    setSelectedTableId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="tables" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              Book a Table
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Menu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-6">
            <TimeSlotSelector />

            {/* Status Banner */}
            <Card
              className={`border-2 ${
                freeTables > 0
                  ? "bg-status-free/10 border-status-free/30"
                  : "bg-status-reserved/10 border-status-reserved/30"
              }`}
            >
              <CardContent className="p-6 text-center">
                {freeTables > 0 ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-status-free mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Seats Available</h2>
                    <p className="text-muted-foreground">
                      We have <span className="font-semibold text-status-free">{freeTables}</span> tables ready for the
                      selected slot. Click a table to book.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Clock className="w-12 h-12 text-status-reserved mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">All tables booked for this slot</h2>
                    <p className="text-muted-foreground">Try selecting a different time slot or date.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border border-border/50">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-status-free" />
                    Available
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold text-status-free">{freeTables}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Occupied
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold text-foreground">{waitingCount}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Wait Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold text-accent">{waitTime}m</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Select a Table to Book</h3>
              <TablesGrid customerBooking={true} onCustomerBook={handleOpenBookingModal} />
            </div>
          </TabsContent>

          <TabsContent value="menu">
            <MenuSection />
          </TabsContent>
        </Tabs>
      </main>

      {selectedTableId !== null && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          tableId={selectedTableId}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}
