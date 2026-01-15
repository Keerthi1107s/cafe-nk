"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem } from "@/lib/menu-data"

interface MenuItemCardProps {
  item: MenuItem
  onClick: () => void
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/50 group"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
          ₹{item.price}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
    </Card>
  )
}
