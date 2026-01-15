"use client"

import { useCafeStore } from "@/lib/cafe-store"
import { TableCard } from "./table-card"
import { CustomerTableCard } from "./customer-table-card"

interface TablesGridProps {
  interactive?: boolean
  customerBooking?: boolean
  onCustomerBook?: (tableId: number) => void
}

export function TablesGrid({ interactive = false, customerBooking = false, onCustomerBook }: TablesGridProps) {
  const { tables, selectedDate, selectedSlot, addBooking, cancelBooking, getTableStatusForSlot } = useCafeStore()

  const handleCycleStatus = (tableId: number) => {
    if (!selectedSlot) return

    const currentStatus = getTableStatusForSlot(tableId, selectedDate, selectedSlot)

    if (currentStatus === "free") {
      // Book the table for this slot
      addBooking(tableId, selectedDate, selectedSlot)
    } else {
      // Cancel any booking for this slot
      cancelBooking(tableId, selectedDate, selectedSlot.start)
    }
  }

  if (customerBooking && onCustomerBook) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {tables.map((table) => (
          <CustomerTableCard key={table.id} table={table} onBook={onCustomerBook} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onClick={interactive ? () => handleCycleStatus(table.id) : undefined}
          interactive={interactive}
        />
      ))}
    </div>
  )
}
