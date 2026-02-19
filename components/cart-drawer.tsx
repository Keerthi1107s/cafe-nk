"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/lib/menu-data"
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onCheckout: () => void
  total: number
}

export function CartDrawer({
  open,
  onOpenChange,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  total,
}: CartDrawerProps) {
  if (cartItems.length === 0 && !open) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-3 my-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4 space-y-3">
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">₹{item.price} per item</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Customizations */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {item.portionSize && (
                      <p>
                        <span className="font-medium">Portion:</span> {item.portionSize.charAt(0).toUpperCase() + item.portionSize.slice(1)}
                      </p>
                    )}
                    {item.spiceLevel && (
                      <p>
                        <span className="font-medium">Spice:</span> {item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)}
                      </p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p>
                        <span className="font-medium">Add-ons:</span> {item.selectedAddOns.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                      <p>
                        <span className="font-medium">Toppings:</span> {item.selectedToppings.map((t) => t.name).join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p>
                        <span className="font-medium">Notes:</span> {item.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-primary">₹{item.itemTotal}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{cartItems.reduce((sum, item) => sum + item.itemTotal, 0)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>

              {/* Checkout Button */}
              <Button onClick={onCheckout} className="w-full h-11 text-base font-semibold">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
