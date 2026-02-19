"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/menu-data"
import { Star, Flame, Plus } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  onCustomize: () => void
  onQuickAdd?: () => void
}

export function MenuItemCard({ item, onCustomize, onQuickAdd }: MenuItemCardProps) {
  const vegColor = item.vegType === "veg" ? "text-green-600" : "text-red-600"

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-wrap">
            {item.popular && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            {item.vegType && (
              <span className={`font-bold text-xs px-2 py-1 rounded ${vegColor === "text-green-600" ? "bg-green-100" : "bg-red-100"}`}>
                <span className={`w-2 h-2 rounded-full inline-block ${vegColor} mr-1`}></span>
                {item.vegType === "veg" ? "Veg" : "Non-Veg"}
              </span>
            )}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
          ₹{item.price}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
            {item.rating && (
              <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700">{item.rating}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        </div>

        {/* Spice Indicator */}
        {item.canCustomizeSpice && item.defaultSpice && (
          <div className="flex items-center gap-1 mt-2 mb-3">
            {["mild", "medium", "hot"].includes(item.defaultSpice) && (
              <>
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-muted-foreground capitalize">{item.defaultSpice}</span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onCustomize}
            className="flex-1 h-9"
          >
            Customize
          </Button>
          {onQuickAdd && (
            <Button
              size="sm"
              onClick={onQuickAdd}
              className="h-9 w-9 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
