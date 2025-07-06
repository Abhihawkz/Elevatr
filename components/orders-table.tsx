"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  customerName: string
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

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
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

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders Found</CardTitle>
          <CardDescription>You haven't placed any orders yet. Start shopping to see your orders here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History ({orders.length})</CardTitle>
        <CardDescription>Track and manage all your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.slice(-8)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-background"
                        >
                          <Image
                            src={item.product.image || "/placeholder.svg?height=32&width=32"}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
