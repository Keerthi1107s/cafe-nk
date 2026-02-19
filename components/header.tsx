"use client"

import { Coffee, LogOut, BarChart3, ClipboardList, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCafeStore } from "@/lib/cafe-store"

interface HeaderProps {
  showAnalytics?: boolean
  onToggleAnalytics?: () => void
  analyticsActive?: boolean
  activeTab?: "reservations" | "orders"
  onTabChange?: (tab: "reservations" | "orders") => void
}

export function Header({ showAnalytics, onToggleAnalytics, analyticsActive, activeTab, onTabChange }: HeaderProps) {
  const { userRole, setUserRole } = useCafeStore()

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Coffee className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm md:text-base">Rameshwaram Cafe</h1>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole === "staff" ? "🧑‍🍳 Staff Dashboard" : "☕ Customer View"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userRole === "staff" && activeTab && (
            <div className="flex gap-1">
              <Button
                variant={activeTab === "reservations" ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange?.("reservations")}
                className="gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="hidden sm:inline">Reservations</span>
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange?.("orders")}
                className="gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </div>
          )}
          {showAnalytics && (
            <Button
              variant={analyticsActive ? "default" : "outline"}
              size="sm"
              onClick={onToggleAnalytics}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserRole(null)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
