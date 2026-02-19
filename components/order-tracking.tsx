"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Order, OrderStatus } from "@/lib/cafe-store"
import { CheckCircle2, Circle, Truck, Home, Phone, MapPin, Clock } from "lucide-react"

interface OrderTrackingProps {
  order: Order
  onBack: () => void
}

export function OrderTracking({ order, onBack }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)
  const [displayTime, setDisplayTime] = useState<number>(order.estimatedDeliveryTime || 40)

  // Simulate order status progression
  useEffect(() => {
    const statusSequence: OrderStatus[] = ["pending", "preparing", "ready", "completed"]
    const currentIndex = statusSequence.indexOf(currentStatus)

    if (currentIndex < statusSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStatus(statusSequence[currentIndex + 1])
        setDisplayTime(Math.max(0, displayTime - 10))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentStatus, displayTime])

  const statusSteps = [
    {
      id: "pending",
      label: "Order Confirmed",
      description: "Your order has been placed",
      icon: CheckCircle2,
    },
    {
      id: "preparing",
      label: "Preparing",
      description: "Our team is preparing your food",
      icon: Clock,
    },
    {
      id: "ready",
      label: "Ready for Delivery",
      description: "Your order is on the way",
      icon: Truck,
    },
    {
      id: "completed",
      label: "Delivered",
      description: "Order delivered successfully",
      icon: Home,
    },
  ]

  const getStepStatus = (stepId: string) => {
    const statusSequence = ["pending", "preparing", "ready", "completed"]
    const currentIndex = statusSequence.indexOf(currentStatus)
    const stepIndex = statusSequence.indexOf(stepId)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  return (
    <div className="space-y-6">
      {/* Order ID and Time */}
      <Card className="p-4 bg-primary/5">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="text-2xl font-bold text-primary">{order.id}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
            <Clock className="w-4 h-4" />
            <span>
              {displayTime > 0
                ? `${displayTime} minutes remaining`
                : "Order should be with you shortly"}
            </span>
          </div>
        </div>
      </Card>

      {/* Progress Steps */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const Icon = step.icon
          const status = getStepStatus(step.id)

          return (
            <div key={step.id}>
              {/* Step */}
              <div className="flex gap-4">
                {/* Timeline Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      status === "completed"
                        ? "bg-green-100"
                        : status === "current"
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-muted"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : status === "current" ? (
                      <Icon className="w-5 h-5 text-primary animate-bounce" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`w-1 h-12 mt-1 ${
                        status === "completed" ? "bg-green-200" : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <h4
                    className={`font-semibold text-sm ${
                      status === "completed" || status === "current"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact Support */}
      {order.status !== "completed" && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="space-y-3">
            <p className="font-semibold text-sm text-blue-900">Need Help Tracking Your Order?</p>
            <Button variant="outline" className="w-full text-blue-700 border-blue-300">
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>
      )}

      {/* Order Details */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-base">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Items
            </span>
            <span className="font-medium">{order.items.length} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-bold text-primary">₹{order.totalPrice}</span>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="w-full">
        Back to Menu
      </Button>
    </div>
  )
}
