"use client"

import { create } from "zustand"

export type TableStatus = "free" | "occupied" | "reserved"

export interface TimeSlot {
  start: string // "08:00"
  end: string // "08:30"
  label: string // "8:00 AM - 8:30 AM"
}

export interface Booking {
  tableId: number
  date: string // "2025-01-15"
  slotStart: string // "08:00"
  slotEnd: string // "08:30"
  bookedAt: Date
}

export interface Table {
  id: number
  capacity: number
}

export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let hour = 8; hour < 22; hour++) {
    for (let half = 0; half < 2; half++) {
      const startMinute = half * 30
      const endHour = startMinute === 30 ? hour + 1 : hour
      const endMinute = startMinute === 30 ? 0 : 30

      const start = `${hour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`
      const end = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

      const formatTime = (h: number, m: number) => {
        const period = h >= 12 ? "PM" : "AM"
        const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
        return `${hour12}:${m.toString().padStart(2, "0")} ${period}`
      }

      const label = `${formatTime(hour, startMinute)} - ${formatTime(endHour, endMinute)}`
      slots.push({ start, end, label })
    }
  }
  return slots
}

export const TIME_SLOTS = generateTimeSlots()

export function getCurrentTimeSlot(): TimeSlot | null {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

  for (const slot of TIME_SLOTS) {
    if (currentTime >= slot.start && currentTime < slot.end) {
      return slot
    }
  }
  return null
}

export function isSlotInPast(date: string, slotStart: string): boolean {
  const now = new Date()
  const today = now.toISOString().split("T")[0]

  if (date < today) return true
  if (date > today) return false

  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  return slotStart <= currentTime
}

export function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

interface CafeStore {
  tables: Table[]
  bookings: Booking[]
  userRole: "staff" | "customer" | null
  selectedDate: string
  selectedSlot: TimeSlot | null

  setUserRole: (role: "staff" | "customer" | null) => void
  setSelectedDate: (date: string) => void
  setSelectedSlot: (slot: TimeSlot | null) => void

  addBooking: (tableId: number, date: string, slot: TimeSlot) => boolean
  cancelBooking: (tableId: number, date: string, slotStart: string) => void
  getBookingsForTable: (tableId: number) => Booking[]
  getBookingsForSlot: (date: string, slot: TimeSlot) => Booking[]
  isTableBookedForSlot: (tableId: number, date: string, slot: TimeSlot) => boolean
  getAvailableSlotsForTable: (tableId: number, date: string) => TimeSlot[]

  getTableStatusForSlot: (tableId: number, date: string, slot: TimeSlot) => TableStatus
  getFreeTablesForSlot: (date: string, slot: TimeSlot) => number
  getOccupiedTablesForSlot: (date: string, slot: TimeSlot) => number
  getReservedTablesForSlot: (date: string, slot: TimeSlot) => number
  getEstimatedWaitTime: (date: string, slot: TimeSlot) => number

  getMostBookedSlot: () => { slot: TimeSlot; count: number } | null
  getBookingsPerSlot: () => { slot: string; count: number }[]
  getDailyUtilization: () => number
  getTotalBookingsToday: () => number
}

const initialTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  capacity: i < 4 ? 2 : i < 7 ? 4 : 6,
}))

const today = new Date().toISOString().split("T")[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0]

const sampleBookings: Booking[] = [
  // Today - Morning slots
  { tableId: 1, date: today, slotStart: "08:00", slotEnd: "08:30", bookedAt: new Date() },
  { tableId: 3, date: today, slotStart: "08:30", slotEnd: "09:00", bookedAt: new Date() },
  { tableId: 2, date: today, slotStart: "09:00", slotEnd: "09:30", bookedAt: new Date() },
  { tableId: 5, date: today, slotStart: "09:30", slotEnd: "10:00", bookedAt: new Date() },
  { tableId: 4, date: today, slotStart: "10:00", slotEnd: "10:30", bookedAt: new Date() },
  { tableId: 6, date: today, slotStart: "10:30", slotEnd: "11:00", bookedAt: new Date() },
  // Today - Lunch slots (busy)
  { tableId: 1, date: today, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 2, date: today, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 3, date: today, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 4, date: today, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 5, date: today, slotStart: "12:30", slotEnd: "13:00", bookedAt: new Date() },
  { tableId: 6, date: today, slotStart: "12:30", slotEnd: "13:00", bookedAt: new Date() },
  { tableId: 7, date: today, slotStart: "12:30", slotEnd: "13:00", bookedAt: new Date() },
  { tableId: 8, date: today, slotStart: "13:00", slotEnd: "13:30", bookedAt: new Date() },
  { tableId: 9, date: today, slotStart: "13:00", slotEnd: "13:30", bookedAt: new Date() },
  { tableId: 10, date: today, slotStart: "13:00", slotEnd: "13:30", bookedAt: new Date() },
  // Today - Afternoon
  { tableId: 2, date: today, slotStart: "15:00", slotEnd: "15:30", bookedAt: new Date() },
  { tableId: 4, date: today, slotStart: "15:30", slotEnd: "16:00", bookedAt: new Date() },
  { tableId: 7, date: today, slotStart: "16:00", slotEnd: "16:30", bookedAt: new Date() },
  // Today - Evening slots (busy dinner time)
  { tableId: 1, date: today, slotStart: "18:00", slotEnd: "18:30", bookedAt: new Date() },
  { tableId: 2, date: today, slotStart: "18:00", slotEnd: "18:30", bookedAt: new Date() },
  { tableId: 3, date: today, slotStart: "18:00", slotEnd: "18:30", bookedAt: new Date() },
  { tableId: 5, date: today, slotStart: "19:00", slotEnd: "19:30", bookedAt: new Date() },
  { tableId: 6, date: today, slotStart: "19:00", slotEnd: "19:30", bookedAt: new Date() },
  { tableId: 7, date: today, slotStart: "19:00", slotEnd: "19:30", bookedAt: new Date() },
  { tableId: 8, date: today, slotStart: "19:00", slotEnd: "19:30", bookedAt: new Date() },
  { tableId: 9, date: today, slotStart: "19:30", slotEnd: "20:00", bookedAt: new Date() },
  { tableId: 10, date: today, slotStart: "19:30", slotEnd: "20:00", bookedAt: new Date() },
  { tableId: 1, date: today, slotStart: "20:00", slotEnd: "20:30", bookedAt: new Date() },
  { tableId: 3, date: today, slotStart: "20:00", slotEnd: "20:30", bookedAt: new Date() },
  { tableId: 4, date: today, slotStart: "20:30", slotEnd: "21:00", bookedAt: new Date() },
  { tableId: 5, date: today, slotStart: "20:30", slotEnd: "21:00", bookedAt: new Date() },
  { tableId: 8, date: today, slotStart: "21:00", slotEnd: "21:30", bookedAt: new Date() },
  // Tomorrow - Various slots
  { tableId: 1, date: tomorrow, slotStart: "09:00", slotEnd: "09:30", bookedAt: new Date() },
  { tableId: 2, date: tomorrow, slotStart: "10:00", slotEnd: "10:30", bookedAt: new Date() },
  { tableId: 3, date: tomorrow, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 4, date: tomorrow, slotStart: "12:00", slotEnd: "12:30", bookedAt: new Date() },
  { tableId: 5, date: tomorrow, slotStart: "12:30", slotEnd: "13:00", bookedAt: new Date() },
  { tableId: 6, date: tomorrow, slotStart: "13:00", slotEnd: "13:30", bookedAt: new Date() },
  { tableId: 7, date: tomorrow, slotStart: "18:30", slotEnd: "19:00", bookedAt: new Date() },
  { tableId: 8, date: tomorrow, slotStart: "19:00", slotEnd: "19:30", bookedAt: new Date() },
  { tableId: 9, date: tomorrow, slotStart: "19:30", slotEnd: "20:00", bookedAt: new Date() },
  { tableId: 10, date: tomorrow, slotStart: "20:00", slotEnd: "20:30", bookedAt: new Date() },
  // Day after tomorrow
  { tableId: 2, date: dayAfter, slotStart: "11:00", slotEnd: "11:30", bookedAt: new Date() },
  { tableId: 4, date: dayAfter, slotStart: "12:30", slotEnd: "13:00", bookedAt: new Date() },
  { tableId: 6, date: dayAfter, slotStart: "18:00", slotEnd: "18:30", bookedAt: new Date() },
  { tableId: 8, date: dayAfter, slotStart: "19:30", slotEnd: "20:00", bookedAt: new Date() },
]

export const useCafeStore = create<CafeStore>((set, get) => ({
  tables: initialTables,
  bookings: sampleBookings,
  userRole: null,
  selectedDate: today,
  selectedSlot: getCurrentTimeSlot() || TIME_SLOTS[0],

  setUserRole: (role) => set({ userRole: role }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  addBooking: (tableId, date, slot) => {
    // Prevent past bookings
    if (isSlotInPast(date, slot.start)) return false

    // Check if already booked
    if (get().isTableBookedForSlot(tableId, date, slot)) return false

    const newBooking: Booking = {
      tableId,
      date,
      slotStart: slot.start,
      slotEnd: slot.end,
      bookedAt: new Date(),
    }

    set((state) => ({
      bookings: [...state.bookings, newBooking],
    }))
    return true
  },

  cancelBooking: (tableId, date, slotStart) => {
    set((state) => ({
      bookings: state.bookings.filter((b) => !(b.tableId === tableId && b.date === date && b.slotStart === slotStart)),
    }))
  },

  getBookingsForTable: (tableId) => {
    return get().bookings.filter((b) => b.tableId === tableId)
  },

  getBookingsForSlot: (date, slot) => {
    return get().bookings.filter((b) => b.date === date && b.slotStart === slot.start)
  },

  isTableBookedForSlot: (tableId, date, slot) => {
    return get().bookings.some((b) => b.tableId === tableId && b.date === date && b.slotStart === slot.start)
  },

  getAvailableSlotsForTable: (tableId, date) => {
    const bookedSlots = get()
      .bookings.filter((b) => b.tableId === tableId && b.date === date)
      .map((b) => b.slotStart)

    return TIME_SLOTS.filter((slot) => {
      if (bookedSlots.includes(slot.start)) return false
      if (isSlotInPast(date, slot.start)) return false
      return true
    })
  },

  getTableStatusForSlot: (tableId, date, slot) => {
    const booking = get().bookings.find((b) => b.tableId === tableId && b.date === date && b.slotStart === slot.start)

    if (!booking) return "free"

    // Check if current time is within this slot
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    if (date === todayStr && currentTime >= slot.start && currentTime < slot.end) {
      return "occupied"
    }

    return "reserved"
  },

  getFreeTablesForSlot: (date, slot) => {
    const { tables } = get()
    return tables.filter((t) => get().getTableStatusForSlot(t.id, date, slot) === "free").length
  },

  getOccupiedTablesForSlot: (date, slot) => {
    const { tables } = get()
    return tables.filter((t) => get().getTableStatusForSlot(t.id, date, slot) === "occupied").length
  },

  getReservedTablesForSlot: (date, slot) => {
    const { tables } = get()
    return tables.filter((t) => get().getTableStatusForSlot(t.id, date, slot) === "reserved").length
  },

  getEstimatedWaitTime: (date, slot) => {
    const freeTables = get().getFreeTablesForSlot(date, slot)
    if (freeTables > 0) return 0
    return 30 // One slot duration
  },

  getMostBookedSlot: () => {
    const { bookings } = get()
    if (bookings.length === 0) return null

    const slotCounts = new Map<string, number>()
    bookings.forEach((b) => {
      const count = slotCounts.get(b.slotStart) || 0
      slotCounts.set(b.slotStart, count + 1)
    })

    let maxSlot = ""
    let maxCount = 0
    slotCounts.forEach((count, slot) => {
      if (count > maxCount) {
        maxCount = count
        maxSlot = slot
      }
    })

    const slot = TIME_SLOTS.find((s) => s.start === maxSlot)
    return slot ? { slot, count: maxCount } : null
  },

  getBookingsPerSlot: () => {
    const { bookings } = get()
    const today = new Date().toISOString().split("T")[0]
    const todayBookings = bookings.filter((b) => b.date === today)

    return TIME_SLOTS.map((slot) => ({
      slot: slot.start.replace(":00", "").replace(":30", ":30"),
      count: todayBookings.filter((b) => b.slotStart === slot.start).length,
    })).filter((_, i) => i % 2 === 0) // Show hourly for cleaner chart
  },

  getDailyUtilization: () => {
    const { tables, bookings } = get()
    const today = new Date().toISOString().split("T")[0]
    const todayBookings = bookings.filter((b) => b.date === today).length
    const totalSlots = tables.length * TIME_SLOTS.length
    return Math.round((todayBookings / totalSlots) * 100)
  },

  getTotalBookingsToday: () => {
    const today = new Date().toISOString().split("T")[0]
    return get().bookings.filter((b) => b.date === today).length
  },
}))
