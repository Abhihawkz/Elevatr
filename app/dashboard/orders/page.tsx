import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserHeader } from "@/components/user-header"
import { OrdersTable } from "@/components/orders-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
              store: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "USER") {
    redirect("/auth/signin")
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your order history</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <OrdersTable orders={orders} />
      </main>
    </div>
  )
}
