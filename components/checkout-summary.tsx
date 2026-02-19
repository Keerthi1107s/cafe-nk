"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/lib/menu-data"
import { Package, Clock } from "lucide-react"

interface CheckoutSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  tax: number
  delivery: number
  discount: number
  total: number
  estimatedTime?: number
}

export function CheckoutSummary({
  cartItems,
  subtotal,
  tax,
  delivery,
  discount,
  total,
  estimatedTime = 40,
}: CheckoutSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Items List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Package className="w-4 h-4" />
          Order Summary
        </h3>

        {cartItems.map((item) => (
          <Card key={item.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-sm font-semibold">₹{item.itemTotal}</span>
                </div>

                {/* Item Details */}
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Qty: <span className="font-medium">{item.quantity}x</span></p>
                  {item.portionSize && (
                    <p>Portion: <span className="font-medium capitalize">{item.portionSize}</span></p>
                  )}
                  {item.spiceLevel && (
                    <p>Spice: <span className="font-medium capitalize">{item.spiceLevel}</span></p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p>Add-ons: <span className="font-medium">{item.selectedAddOns.map((a) => a.name).join(", ")}</span></p>
                  )}
                  {item.selectedToppings && item.selectedToppings.length > 0 && (
                    <p>Toppings: <span className="font-medium">{item.selectedToppings.map((t) => t.name).join(", ")}</span></p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Cost Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Taxes (5%)</span>
          <span>₹{tax}</span>
        </div>
        {delivery > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery Charges</span>
            <span>₹{delivery}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span className="font-medium">Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
        <span className="font-bold text-base">Total Amount</span>
        <span className="text-2xl font-bold text-primary">₹{total}</span>
      </div>

      {/* Estimated Delivery Time */}
      <Card className="p-3 bg-blue-50 border-blue-200 flex items-center gap-3">
        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <div className="text-sm">
          <div className="font-semibold text-blue-900">Estimated Delivery Time</div>
          <div className="text-xs text-blue-700">{estimatedTime} minutes from order confirmation</div>
        </div>
      </Card>
    </div>
  )
}
