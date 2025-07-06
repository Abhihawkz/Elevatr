import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, TrendingUp, DollarSign, Package, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"

async function getAdminStats(userId: string) {
  const store = await prisma.store.findUnique({
    where: { userId },
    include: {
      products: {
        include: {
          orderItems: true,
        },
      },
    },
  })

  if (!store) return null

  const totalProducts = store.products.length
  const totalOrders = await prisma.order.count()
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
  })

  const mostViewedProducts = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { views: "desc" },
    take: 5,
    include: { category: true },
  })

  return {
    store,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    mostViewedProducts,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const stats = await getAdminStats(session.user.id)

  if (!stats?.store) {
    redirect("/admin/onboarding")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name}! Here's what's happening with your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings in your store</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.mostViewedProducts.reduce((sum, product) => sum + product.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total product views</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Viewed Products */}
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Products</CardTitle>
              <CardDescription>Your top performing products by views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.mostViewedProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">{product.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.views} views</p>
                      <p className="text-sm text-muted-foreground">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your store efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/admin/products/new">
                    <Plus className="h-6 w-6 mb-2" />
                    Add Product
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/admin/products">
                    <Package className="h-6 w-6 mb-2" />
                    Manage Products
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/admin/orders">
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    View Orders
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 flex-col bg-transparent">
                  <Link href="/admin/marketing">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Marketing
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
