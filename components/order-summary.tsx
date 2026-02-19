"use client"

import { useCafeStore } from "@/lib/cafe-store"
import { menuItems, spiceLevels } from "@/lib/menu-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrderSummary() {
  const { getOrdersForTable } = useCafeStore()
  const orders = getOrdersForTable(1) // Default table 1

  if (orders.length === 0) {
    return (
      <Card className="border border-border/50">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No orders yet. Select items from the menu to get started.</p>
        </CardContent>
      </Card>
    )
  }

  const totalOrderPrice = orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((itemSum, item) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId)
        return itemSum + (menuItem?.price || 0) * item.quantity
      }, 0)
    )
  }, 0)

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{order.id}</CardTitle>
              <Badge
                variant={
                  order.status === "ready"
                    ? "default"
                    : order.status === "served"
                      ? "secondary"
                      : "outline"
                }
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => {
              const menuItem = menuItems.find((m) => m.id === item.menuItemId)
              const spice = spiceLevels.find((s) => s.id === item.spiceLevel)
              if (!menuItem) return null

              return (
                <div key={item.id} className="flex items-start justify-between text-sm py-2 border-b border-border/30 last:border-0">
                  <div className="flex-1">
                    <div className="font-medium">{menuItem.name}</div>
                    <div className="text-muted-foreground">Qty: {item.quantity}</div>
                    {spice && (
                      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 mt-1">
                        <Flame className="w-3 h-3" />
                        <span className="text-xs">{spice.label}</span>
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="text-xs text-muted-foreground italic mt-1">"{item.specialInstructions}"</div>
                    )}
                  </div>
                  <div className="font-semibold text-right">₹{(menuItem.price || 0) * item.quantity}</div>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-3 border-t border-border font-semibold">
              <span>Order Total</span>
              <span className="text-primary text-lg">
                ₹
                {order.items.reduce((sum, item) => {
                  const menuItem = menuItems.find((m) => m.id === item.menuItemId)
                  return sum + (menuItem?.price || 0) * item.quantity
                }, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      {orders.length > 0 && (
        <Card className="border border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">All Orders Total</span>
              <span className="text-xl font-bold text-primary">₹{totalOrderPrice}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
