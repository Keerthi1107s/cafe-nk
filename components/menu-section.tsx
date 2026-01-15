"use client"

import { useState } from "react"
import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuItemCard } from "./menu-item-card"
import { MenuItemModal } from "./menu-item-modal"
import { menuItems, categories, type MenuItem, type MenuCategory } from "@/lib/menu-data"

export function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Menu Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Our Menu</h2>
          <p className="text-sm text-muted-foreground">Explore our delicious offerings</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="rounded-full"
        >
          All Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full"
          >
            {category.emoji} {category.label}
          </Button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No items found in this category.</div>
      )}

      <MenuItemModal item={selectedItem} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
