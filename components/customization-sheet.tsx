"use client"

import { useState, useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MenuItem, CartItem, SpiceLevel, PortionSize, AddOn, Topping } from "@/lib/menu-data"
import { spiceLevels, portionSizes, commonAddOns, commonToppings, menuItems } from "@/lib/menu-data"
import { Minus, Plus, Flame, Check } from "lucide-react"

interface CustomizationSheetProps {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (cartItem: CartItem) => void
}

export function CustomizationSheet({ item, open, onOpenChange, onAddToCart }: CustomizationSheetProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | undefined>(item?.defaultSpice)
  const [selectedPortion, setSelectedPortion] = useState<PortionSize>("full")
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")

  const itemData = useMemo(() => {
    return item ? menuItems.find((m) => m.id === item.id) : null
  }, [item])

  const calculatePrice = () => {
    if (!itemData) return 0
    const basePrice = itemData.portionPrices?.[selectedPortion] || itemData.price
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
    return basePrice + addOnsTotal
  }

  const itemTotal = calculatePrice() * quantity

  const handleAddToCart = () => {
    if (!item) return

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: calculatePrice(),
      quantity,
      spiceLevel: selectedSpice,
      portionSize: selectedPortion,
      selectedAddOns,
      selectedToppings,
      specialInstructions: specialInstructions || undefined,
      itemTotal,
    }

    onAddToCart(cartItem)

    // Reset form
    setQuantity(1)
    setSelectedSpice(item.defaultSpice)
    setSelectedPortion("full")
    setSelectedAddOns([])
    setSelectedToppings([])
    setSpecialInstructions("")
    onOpenChange(false)
  }

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    )
  }

  if (!item || !itemData) return null

  const canProceed = !itemData.canCustomizeSpice || selectedSpice !== undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
          <SheetTitle className="text-left">{item.name}</SheetTitle>
          <p className="text-sm text-muted-foreground text-left">{item.description}</p>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          {/* Spice Level - Required */}
          {itemData.canCustomizeSpice && (
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Spice Level <span className="text-red-500">*</span>
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

          {/* Portion Size - Required */}
          {itemData.availablePortions && itemData.availablePortions.length > 1 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Portion Size <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-3 gap-2">
                {portionSizes
                  .filter((ps) => itemData.availablePortions?.includes(ps.id))
                  .map((portion) => (
                    <button
                      key={portion.id}
                      onClick={() => setSelectedPortion(portion.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedPortion === portion.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{portion.label}</div>
                      <div className="text-xs text-muted-foreground">
                        ₹{itemData.portionPrices?.[portion.id] || itemData.price}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Add-ons - Optional */}
          {itemData.availableAddOns && itemData.availableAddOns.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add-ons</Label>
              <div className="space-y-2">
                {itemData.availableAddOns.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedAddOns.find((a) => a.id === addon.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{addon.name}</div>
                      <div className="text-xs text-muted-foreground">+₹{addon.price}</div>
                    </div>
                    {selectedAddOns.find((a) => a.id === addon.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings - Optional */}
          {itemData.availableToppings && itemData.availableToppings.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Toppings</Label>
              <div className="grid grid-cols-2 gap-2">
                {itemData.availableToppings.map((topping) => (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedToppings.find((t) => t.id === topping.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{topping.name}</div>
                    {selectedToppings.find((t) => t.id === topping.id) && (
                      <Check className="w-4 h-4 text-primary mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Special Instructions (Optional)</Label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 200))}
              placeholder="e.g., Extra spicy, no onions, extra sauce..."
              className="w-full p-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{specialInstructions.length}/200</p>
          </div>
        </div>

        {/* Sticky Footer */}
        <SheetFooter className="sticky bottom-0 bg-background border-t border-border p-4 flex flex-col gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-9 w-9 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold flex-1 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="h-9 w-9 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!canProceed}
            className="w-full h-12 text-base font-semibold"
          >
            <div className="flex items-center justify-between w-full">
              <span>Add to Cart</span>
              <span className="font-bold">₹{itemTotal}</span>
            </div>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
