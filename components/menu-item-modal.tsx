"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { MenuItem } from "@/lib/menu-data"
import { categories } from "@/lib/menu-data"

interface MenuItemModalProps {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuItemModal({ item, open, onOpenChange }: MenuItemModalProps) {
  if (!item) return null

  const category = categories.find((c) => c.id === item.category)

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
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-2xl font-bold text-primary">₹{item.price}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
