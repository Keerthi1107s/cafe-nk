"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MenuItem, SpiceLevel } from "@/lib/menu-data"
import { categories, spiceLevels, menuItems } from "@/lib/menu-data"
import { useCafeStore } from "@/lib/cafe-store"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Flame } from "lucide-react"

interface MenuItemModalProps {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuItemModal({ item, open, onOpenChange }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | undefined>(item?.defaultSpice)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const { addOrder } = useCafeStore()
  const { toast } = useToast()

  if (!item) return null

  const category = categories.find((c) => c.id === item.category)
  const currentMenuItemData = menuItems.find((m) => m.id === item.id)

  const handleAddToOrder = () => {
    const orderItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      quantity,
      spiceLevel: selectedSpice,
      specialInstructions: specialInstructions || undefined,
      timestamp: new Date(),
    }

    // In a real app, you'd have the tableId from the booking context
    // For now, we'll just add to a general order
    addOrder(1, [orderItem]) // Default to table 1

    toast({
      title: "Added to order",
      description: `${quantity}x ${item.name} added to your order`,
    })

    // Reset form
    setQuantity(1)
    setSelectedSpice(item.defaultSpice)
    setSpecialInstructions("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="relative h-56">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2">
              {category?.emoji} {category?.label}
            </Badge>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">{item.name}</DialogTitle>
            </DialogHeader>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>

          {/* Price */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground">Price per item</span>
            <span className="text-2xl font-bold text-primary">₹{item.price}</span>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-9 w-9 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Spice Level Customization */}
          {currentMenuItemData?.canCustomizeSpice && (
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Spice Level
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {spiceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedSpice(level.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedSpice === level.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium text-sm">{level.label}</div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Special Instructions (Optional)</Label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Extra spicy, no onions, etc."
              className="w-full p-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={2}
            />
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm font-medium">Total</span>
            <span className="text-2xl font-bold text-primary">₹{item.price * quantity}</span>
          </div>

          {/* Add to Order Button */}
          <Button onClick={handleAddToOrder} className="w-full h-11 text-base font-semibold">
            Add to Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
