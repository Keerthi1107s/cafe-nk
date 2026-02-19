"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  AlertCircle,
  ChefHat,
  CheckCircle2,
  Truck,
  RefreshCw,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCafeStore, type OrderStatus } from "@/lib/cafe-store"
import { useToast } from "@/hooks/use-toast"

const statusConfig: Record<OrderStatus, { color: string; icon: any; label: string; bgColor: string }> = {
  pending: {
    color: "text-yellow-600",
    icon: AlertCircle,
    label: "Pending",
    bgColor: "bg-yellow-50",
  },
  preparing: {
    color: "text-blue-600",
    icon: ChefHat,
    label: "Preparing",
    bgColor: "bg-blue-50",
  },
  ready: {
    color: "text-green-600",
    icon: CheckCircle2,
    label: "Ready",
    bgColor: "bg-green-50",
  },
  served: {
    color: "text-purple-600",
    icon: Truck,
    label: "Served",
    bgColor: "bg-purple-50",
  },
  completed: {
    color: "text-gray-600",
    icon: CheckCircle2,
    label: "Completed",
    bgColor: "bg-gray-50",
  },
}

export function StaffOrders() {
  const { orders: allOrders, updateOrderStatus } = useCafeStore()
  const { toast } = useToast()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("pending")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Auto-refresh every 3 seconds
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredOrders =
    filterStatus === "all" ? allOrders : allOrders.filter((order) => order.status === filterStatus)

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
    const statusLabel = statusConfig[newStatus].label
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-4)} marked as ${statusLabel}`,
    })
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: "preparing",
      preparing: "ready",
      ready: "served",
      served: "completed",
      completed: null,
    }
    return statusFlow[currentStatus]
  }

  const orderStats = {
    pending: allOrders.filter((o) => o.status === "pending").length,
    preparing: allOrders.filter((o) => o.status === "preparing").length,
    ready: allOrders.filter((o) => o.status === "ready").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preparing</p>
                <p className="text-3xl font-bold text-blue-600">{orderStats.preparing}</p>
              </div>
              <ChefHat className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready for Delivery</p>
                <p className="text-3xl font-bold text-green-600">{orderStats.ready}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
        </div>
      </div>

      {/* Orders Tabs */}
      <Tabs value={filterStatus} onValueChange={(val) => setFilterStatus(val as OrderStatus | "all")}>
        <TabsList>
          <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orderStats.pending})
          </TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({orderStats.preparing})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({orderStats.ready})</TabsTrigger>
          <TabsTrigger value="served">Served</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus}>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No orders in this status</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOrders
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((order) => {
                  const config = statusConfig[order.status]
                  const StatusIcon = config.icon
                  const nextStatus = getNextStatus(order.status)

                  return (
                    <Card
                      key={order.id}
                      className={`${config.bgColor} border-l-4 transition-all hover:shadow-md`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Order Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-foreground">Order #{order.id.slice(-4)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <Badge className={config.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>

                          {/* Order Items */}
                          <div className="bg-white/50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-foreground">
                                  {item.quantity}x {item.name}
                                  {item.spiceLevel && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                      ({item.spiceLevel})
                                    </span>
                                  )}
                                </span>
                                <span className="text-muted-foreground">₹{item.itemTotal}</span>
                              </div>
                            ))}
                          </div>

                          {/* Special Instructions */}
                          {order.items.some((item) => item.specialInstructions) && (
                            <div className="bg-white/50 rounded-lg p-3">
                              <p className="text-xs font-medium text-foreground mb-1">Special Instructions:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {order.items
                                  .filter((item) => item.specialInstructions)
                                  .map((item) => (
                                    <li key={item.id}>
                                      • {item.specialInstructions}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Price & Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/30">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Amount</p>
                              <p className="text-lg font-bold text-foreground">₹{order.totalPrice}</p>
                            </div>
                            {nextStatus && (
                              <Button
                                onClick={() => handleStatusChange(order.id, nextStatus)}
                                size="sm"
                                className="gap-2"
                              >
                                <ChefHat className="w-4 h-4" />
                                Mark as {statusConfig[nextStatus].label}
                              </Button>
                            )}
                            {order.status === "completed" && (
                              <div className="text-green-600 text-sm font-medium">✓ Completed</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
