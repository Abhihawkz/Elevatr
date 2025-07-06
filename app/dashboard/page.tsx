import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, Clock, CheckCircle, User, Heart } from "lucide-react"
import Link from "next/link"
import { UserHeader } from "@/components/user-header"
import { RecentOrders } from "@/components/recent-orders"

async function getUserStats(userId: string) {
  const [totalOrders, pendingOrders, completedOrders, recentOrders] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.order.count({
      where: { userId, status: "PENDING" },
    }),
    prisma.order.count({
      where: { userId, status: "DELIVERED" },
    }),
    prisma.order.findMany({
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
      take: 5,
    }),
  ])

  const totalSpent = await prisma.order.aggregate({
    where: { userId, status: { not: "CANCELLED" } },
    _sum: { total: true },
  })

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent: totalSpent._sum.total || 0,
    recentOrders,
  }
}

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "USER") {
    redirect("/auth/signin")
  }

  const stats = await getUserStats(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user?.name}! Here's your account overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchase history</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={stats.recentOrders} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/products">
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/dashboard/orders">
                    <Package className="h-6 w-6 mb-2" />
                    My Orders
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/dashboard/profile">
                    <User className="h-6 w-6 mb-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/dashboard/favorites">
                    <Heart className="h-6 w-6 mb-2" />
                    Favorites
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account information and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Verified Customer</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
