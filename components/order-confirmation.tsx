"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/cafe-store"
import { CheckCircle2, Clock, MapPin, Phone, Share2 } from "lucide-react"

interface OrderConfirmationProps {
  order: Order
  onTrackOrder: () => void
  onContinueShopping: () => void
}

export function OrderConfirmation({
  order,
  onTrackOrder,
  onContinueShopping,
}: OrderConfirmationProps) {
  const shareOrder = () => {
    const message = `I just ordered from Cafe NK! Order ID: ${order.id}. Estimated delivery in ${order.estimatedDeliveryTime} minutes.`
    if (navigator.share) {
      navigator.share({
        title: "Order Placed",
        text: message,
      })
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* Success Animation Area */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
          <div className="relative flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your order has been placed successfully</p>
        </div>
      </div>

      <Separator />

      {/* Order Details */}
      <Card className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Order ID</p>
          <p className="text-lg font-bold text-primary">{order.id}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className="text-sm font-semibold capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="text-lg font-bold text-primary">₹{order.totalPrice}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Est. Time</p>
            <p className="text-sm font-semibold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              {order.estimatedDeliveryTime} min
            </p>
          </div>
        </div>
      </Card>

      {/* What's Next */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base">What's Next?</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Order Confirmed</p>
              <p className="text-xs">Your order is being prepared at our restaurant</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/50 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Out for Delivery</p>
              <p className="text-xs">Your order will be delivered to your address</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/50 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Delivered</p>
              <p className="text-xs">Enjoy your delicious food!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Taxes & Charges</span>
          <span>₹{order.tax}</span>
        </div>
        {order.deliveryCharges > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>₹{order.deliveryCharges}</span>
          </div>
        )}
        {order.discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span className="font-medium">Discount</span>
            <span>-₹{order.discount}</span>
          </div>
        )}
        <Separator />
        <div className="flex items-center justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">₹{order.totalPrice}</span>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={onTrackOrder} className="w-full h-11 text-base font-semibold">
          Track Your Order
        </Button>
        <Button
          variant="outline"
          onClick={shareOrder}
          className="w-full h-11"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Order
        </Button>
        <Button
          variant="ghost"
          onClick={onContinueShopping}
          className="w-full"
        >
          Continue Shopping
        </Button>
      </div>

      {/* Support Contact */}
      <Card className="p-4 bg-muted/50 space-y-2">
        <p className="text-sm font-semibold">Need Help?</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>Call us at +91 1234567890</span>
        </div>
      </Card>
    </div>
  )
}
