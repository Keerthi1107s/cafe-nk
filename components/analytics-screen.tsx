"use client"

import { TrendingUp, BarChart3, Users, CalendarClock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCafeStore, TIME_SLOTS } from "@/lib/cafe-store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts"

export function AnalyticsScreen() {
  const {
    tables,
    selectedDate,
    selectedSlot,
    getFreeTablesForSlot,
    getOccupiedTablesForSlot,
    getReservedTablesForSlot,
    getMostBookedSlot,
    getBookingsPerSlot,
    getDailyUtilization,
    getTotalBookingsToday,
  } = useCafeStore()

  const mostBookedSlot = getMostBookedSlot()
  const bookingsPerSlot = getBookingsPerSlot()
  const dailyUtilization = getDailyUtilization()
  const totalBookingsToday = getTotalBookingsToday()

  const freeTables = selectedSlot ? getFreeTablesForSlot(selectedDate, selectedSlot) : 0
  const occupiedTables = selectedSlot ? getOccupiedTablesForSlot(selectedDate, selectedSlot) : 0
  const reservedTables = selectedSlot ? getReservedTablesForSlot(selectedDate, selectedSlot) : 0

  const utilizationData = [
    { name: "Free", value: freeTables, color: "#4ade80" },
    { name: "Occupied", value: occupiedTables, color: "#ef4444" },
    { name: "Reserved", value: reservedTables, color: "#facc15" },
  ]

  const stats = [
    {
      label: "Peak Slot",
      value: mostBookedSlot ? mostBookedSlot.slot.start.replace(":00", "").replace(":30", ":30") : "N/A",
      icon: TrendingUp,
      description: mostBookedSlot ? `${mostBookedSlot.count} bookings` : "No data",
    },
    {
      label: "Today's Bookings",
      value: totalBookingsToday.toString(),
      icon: CalendarClock,
      description: "Total reservations",
    },
    {
      label: "Utilization",
      value: `${dailyUtilization}%`,
      icon: BarChart3,
      description: "Daily slot usage",
    },
    {
      label: "Total Capacity",
      value: (tables.length * TIME_SLOTS.length).toString(),
      icon: Users,
      description: "Slots per day",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of cafe performance and booking statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/70">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Bookings per Time Slot Chart */}
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Bookings by Time Slot</CardTitle>
            <CardDescription>Distribution of reservations across time slots today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsPerSlot}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="slot" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Utilization Pie Chart */}
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Current Slot Status</CardTitle>
            <CardDescription>Table distribution for selected time slot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Performance Summary</h3>
              <p className="text-sm text-muted-foreground">
                Today's seat utilization is at <span className="font-semibold text-primary">{dailyUtilization}%</span>.
                {mostBookedSlot && (
                  <>
                    {" "}
                    The most popular time slot is{" "}
                    <span className="font-semibold text-primary">{mostBookedSlot.slot.label}</span> with{" "}
                    {mostBookedSlot.count} reservations.
                  </>
                )}{" "}
                Total of <span className="font-semibold text-primary">{totalBookingsToday}</span> bookings recorded
                today.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
