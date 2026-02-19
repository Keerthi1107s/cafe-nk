"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import type { Address } from "@/lib/cafe-store"
import { MapPin, Truck, Clock } from "lucide-react"

interface CheckoutAddressProps {
  onContinue: (address: Address, deliveryType: "delivery" | "pickup") => void
  onBack: () => void
}

export function CheckoutAddress({ onContinue, onBack }: CheckoutAddressProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!phone.trim() || phone.length < 10) newErrors.phone = "Valid phone number is required"
    if (!address.trim()) newErrors.address = "Address is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validate()) {
      onContinue({ name, phone, address, isSaved }, deliveryType)
    }
  }

  return (
    <div className="space-y-6">
      {/* Delivery Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Delivery Type</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDeliveryType("delivery")}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              deliveryType === "delivery"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Truck className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold text-sm">Home Delivery</div>
            <div className="text-xs text-muted-foreground">25-35 mins</div>
          </button>
          <button
            onClick={() => setDeliveryType("pickup")}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              deliveryType === "pickup"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold text-sm">Pickup</div>
            <div className="text-xs text-muted-foreground">15-20 mins</div>
          </button>
        </div>
      </div>

      {/* Address Form */}
      {deliveryType === "delivery" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </h3>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                if (errors.phone) setErrors({ ...errors, phone: "" })
              }}
              maxLength={10}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              placeholder="Street address, building, apartment number, etc."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                if (errors.address) setErrors({ ...errors, address: "" })
              }}
              rows={3}
              className="w-full p-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={isSaved} onCheckedChange={(checked) => setIsSaved(checked === true)} />
            <span className="text-sm text-muted-foreground">Save this address for future orders</span>
          </label>
        </div>
      )}

      {/* Pickup Notice */}
      {deliveryType === "pickup" && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            Your order will be ready for pickup at our restaurant. We'll notify you when it's ready to collect.
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
