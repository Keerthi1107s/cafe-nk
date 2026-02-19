"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { categories, type MenuCategory } from "@/lib/menu-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CategoryTabsProps {
  selectedCategory: MenuCategory | "all"
  onCategoryChange: (category: MenuCategory | "all") => void
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = 200
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="sticky top-[240px] md:top-[280px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-center gap-2">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background to-transparent p-2 rounded hover:from-background/80"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide flex gap-2 px-8 py-3"
            style={{ scrollBehavior: "smooth" }}
          >
            {/* All Items Button */}
            <Button
              variant={selectedCategory === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange("all")}
              className="rounded-full whitespace-nowrap"
            >
              All Items
            </Button>

            {/* Category Buttons */}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="rounded-full whitespace-nowrap"
              >
                <span>{category.emoji}</span>
                <span className="ml-1">{category.label}</span>
              </Button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background to-transparent p-2 rounded hover:from-background/80"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
