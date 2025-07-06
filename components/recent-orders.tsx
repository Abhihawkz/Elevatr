import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  orderItems: {
    quantity: number
    product: {
      id: string
      title: string
      image: string | null
      category: {
        name: string
      }
      store: {
        name: string
      }
    }
  }[]
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No orders yet</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary"
      case "PROCESSING":
        return "default"
      case "SHIPPED":
        return "default"
      case "DELIVERED":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Order #{order.id.slice(-8)}</span>
              <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-2 mb-3">
            {order.orderItems.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                  <Image
                    src={item.product.image || "/placeholder.svg?height=40&width=40"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} • {item.product.store.name}
                  </p>
                </div>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <p className="text-xs text-muted-foreground">+{order.orderItems.length - 2} more items</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">${order.total}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
