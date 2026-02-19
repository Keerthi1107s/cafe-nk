"use client"

import { useState } from "react"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuItemCard } from "./menu-item-card"
import { CategoryTabs } from "./category-tabs"
import { RestaurantHeader } from "./restaurant-header"
import { CustomizationSheet } from "./customization-sheet"
import { CartDrawer } from "./cart-drawer"
import { CheckoutAddress } from "./checkout-address"
import { CheckoutPayment } from "./checkout-payment"
import { CheckoutSummary } from "./checkout-summary"
import { OrderConfirmation } from "./order-confirmation"
import { OrderTracking } from "./order-tracking"
import { menuItems, categories, type MenuItem, type MenuCategory, type CartItem } from "@/lib/menu-data"
import { useCafeStore } from "@/lib/cafe-store"
import { useToast } from "@/hooks/use-toast"

type ViewType = "browse" | "cart" | "checkout-address" | "checkout-payment" | "confirmation" | "tracking"

export function MenuSection() {
  const [currentView, setCurrentView] = useState<ViewType>("browse")
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [customizationOpen, setCustomizationOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  const {
    cartItems,
    cartVisible,
    currentOrder,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    setCartVisible,
    getCheckoutSummary,
    placeOrder,
    updateOrderStatus,
  } = useCafeStore()

  const { toast } = useToast()

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setCustomizationOpen(true)
  }

  const handleQuickAdd = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      itemTotal: item.price,
    }
    addToCart(cartItem)
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    })
  }

  const handleAddToCart = (cartItem: CartItem) => {
    addToCart(cartItem)
    toast({
      title: "Added to cart",
      description: `${cartItem.name} added to your cart`,
    })
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      })
      return
    }
    setCurrentView("checkout-address")
    setCartDrawerOpen(false)
  }

  const handleCheckoutAddress = (address: any, deliveryType: any) => {
    useCafeStore.setState({
      currentCheckout: {
        ...useCafeStore.getState().currentCheckout,
        address,
        deliveryType,
      },
    })
    setCurrentView("checkout-payment")
  }

  const handleCheckoutPayment = (paymentMethod: any, couponCode?: string) => {
    const summary = getCheckoutSummary()
    const order = placeOrder(
      useCafeStore.getState().currentCheckout?.address || { name: "", phone: "", address: "" },
      useCafeStore.getState().currentCheckout?.deliveryType || "delivery",
      paymentMethod
    )

    if (order) {
      setCurrentView("confirmation")
      toast({
        title: "Order placed successfully!",
        description: `Order ID: ${order.id}`,
      })
    }
  }

  // Browse View
  if (currentView === "browse") {
    return (
      <div className="pb-20">
        <RestaurantHeader />
        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onCustomize={() => handleItemClick(item)}
                onQuickAdd={() => handleQuickAdd(item)}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No items found in this category.</div>
          )}
        </div>

        {/* Floating Cart Button */}
        {cartItems.length > 0 && (
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
            aria-label="Open cart"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span className="font-bold">{cartItems.length}</span>
            </div>
          </button>
        )}

        {/* Customization Sheet */}
        <CustomizationSheet
          item={selectedItem}
          open={customizationOpen}
          onOpenChange={setCustomizationOpen}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Drawer */}
        <CartDrawer
          open={cartDrawerOpen}
          onOpenChange={setCartDrawerOpen}
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={(itemId, quantity) => {
            if (quantity > 0) {
              updateCartItem(itemId, { quantity })
            } else {
              removeFromCart(itemId)
            }
          }}
          onCheckout={handleCheckout}
          total={getCartTotal()}
        />
      </div>
    )
  }

  // Checkout Address View
  if (currentView === "checkout-address") {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={() => setCurrentView("browse")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutAddress
          onContinue={handleCheckoutAddress}
          onBack={() => {
            setCurrentView("browse")
            setCartDrawerOpen(true)
          }}
        />
      </div>
    )
  }

  // Checkout Payment View
  if (currentView === "checkout-payment") {
    const summary = getCheckoutSummary()
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={() => setCurrentView("checkout-address")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Payment & Coupon</h1>
        <CheckoutPayment
          onContinue={handleCheckoutPayment}
          onBack={() => setCurrentView("checkout-address")}
          subtotal={summary.subtotal}
          discount={summary.discount}
          total={summary.total}
        />
      </div>
    )
  }

  // Order Confirmation View
  if (currentView === "confirmation" && currentOrder) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <OrderConfirmation
          order={currentOrder}
          onTrackOrder={() => setCurrentView("tracking")}
          onContinueShopping={() => {
            setCurrentView("browse")
            clearCart()
          }}
        />
      </div>
    )
  }

  // Order Tracking View
  if (currentView === "tracking" && currentOrder) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <OrderTracking
          order={currentOrder}
          onBack={() => setCurrentView("browse")}
        />
      </div>
    )
  }

  return null
}
