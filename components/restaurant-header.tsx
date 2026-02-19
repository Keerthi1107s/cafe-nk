"use client"

import { Star, Clock, Truck, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RestaurantHeaderProps {
  onBack?: () => void
}

export function RestaurantHeader({ onBack }: RestaurantHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background">
      {/* Banner Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src="/restaurant-banner.jpg"
          alt="Cafe NK"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1" />
        </div>

        {/* Restaurant Info - Positioned on Banner */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold mb-1">Cafe NK</h1>
              <p className="text-white/80 text-sm">Authentic South Indian & Continental Cuisine</p>
            </div>
            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold text-sm">4.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details Bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">25-35 mins</span>
          </div>
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">₹50 delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">100% VEG</span>
          </div>
        </div>
      </div>
    </div>
  )
}
