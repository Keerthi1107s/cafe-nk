"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { PaymentMethod } from "@/lib/cafe-store"
import { useCafeStore } from "@/lib/cafe-store"
import { CreditCard, Wallet, Zap, Banknote } from "lucide-react"

interface CheckoutPaymentProps {
  onContinue: (method: PaymentMethod, couponCode?: string) => void
  onBack: () => void
  subtotal: number
  discount: number
  total: number
}

export function CheckoutPayment({
  onContinue,
  onBack,
  subtotal,
  discount,
  total,
}: CheckoutPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [couponError, setCouponError] = useState("")
  const { applyCoupon } = useCafeStore()

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code")
      return
    }

    if (applyCoupon(couponCode)) {
      setAppliedCoupon(couponCode)
      setCouponError("")
      setCouponCode("")
    } else {
      setCouponError("Invalid coupon code")
    }
  }

  const paymentMethods: Array<{
    id: PaymentMethod
    label: string
    icon: React.ReactNode
    description: string
  }> = [
    {
      id: "upi",
      label: "UPI",
      icon: <Zap className="w-5 h-5" />,
      description: "Google Pay, PhonePe, Paytm",
    },
    {
      id: "card",
      label: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "wallet",
      label: "Digital Wallet",
      icon: <Wallet className="w-5 h-5" />,
      description: "Amazon Pay, Apple Pay",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: <Banknote className="w-5 h-5" />,
      description: "Pay when you receive",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Payment Method</Label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedMethod === method.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-primary mb-2">{method.icon}</div>
              <div className="font-semibold text-sm">{method.label}</div>
              <div className="text-xs text-muted-foreground">{method.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Apply Coupon (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase())
              setCouponError("")
            }}
            disabled={!!appliedCoupon}
            className="text-sm"
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={!!appliedCoupon}
            className="whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
        {couponError && <p className="text-xs text-red-500">{couponError}</p>}
        {appliedCoupon && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900">
              Coupon "{appliedCoupon}" applied! Get ₹{discount} discount.
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Taxes & Charges</span>
          <span>₹{Math.round(subtotal * 0.05)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span className="font-medium">Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="font-semibold">Total Amount</span>
          <span className="text-lg font-bold text-primary">₹{total}</span>
        </div>
      </Card>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground">
        By placing this order, you agree to our terms and conditions. Your order will be prepared fresh and delivered hot!
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={() => onContinue(selectedMethod, appliedCoupon)} className="flex-1">
          Place Order
        </Button>
      </div>
    </div>
  )
}
