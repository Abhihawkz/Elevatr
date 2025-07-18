import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Star, Users, ShoppingBag, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 8,
    orderBy: { views: "desc" },
    include: {
      category: true,
      store: true,
    },
  })
}

async function getStats() {
  const [totalProducts, totalOrders, totalUsers, totalStores] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.store.count(),
  ])

  return { totalProducts, totalOrders, totalUsers, totalStores }
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 6,
  })
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const [featuredProducts, stats, categories] = await Promise.all([getFeaturedProducts(), getStats(), getCategories()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Elevatr</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 border-border focus:border-primary" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {session.user?.name}</span>
                {session.user?.role === "ADMIN" ? (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/admin">Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/dashboard">My Account</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-foreground hover:text-primary">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-secondary text-secondary-foreground">
            🚀 Elevate Your Business
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Shop from Premium Stores
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover exceptional products from verified premium stores. Elevate your shopping experience with quality
            and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <Link href="/stores">Explore Stores</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-shadow cursor-pointer border-border bg-card"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Products</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Available now</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Stores</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalStores}</div>
                <p className="text-xs text-muted-foreground">Premium sellers</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Happy shoppers</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Featured Products</h2>
            <p className="text-muted-foreground">Discover the most popular items from our premium stores</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow border-border bg-card">
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {product.category.name}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground ml-1">4.5</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2 line-clamp-1 text-foreground">{product.title}</CardTitle>
                  <CardDescription className="mb-3 line-clamp-2 text-muted-foreground">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                      <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">by {product.store.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild className="border-border text-foreground hover:bg-muted bg-transparent">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful sellers on our premium platform</p>
          <Button size="lg" variant="secondary" asChild className="bg-card text-foreground hover:bg-card/90">
            <Link href="/auth/signup">
              Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">Elevatr</span>
              </div>
              <p className="text-muted-foreground">
                Your premium marketplace for discovering exceptional products from verified stores.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Shop</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/stores" className="hover:text-primary">
                    Browse Stores
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-primary">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-primary">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Sell</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/auth/signup" className="hover:text-primary">
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link href="/seller-guide" className="hover:text-primary">
                    Seller Guide
                  </Link>
                </li>
                <li>
                  <Link href="/fees" className="hover:text-primary">
                    Fees & Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Elevatr. Built with Next.js 15 and Tailwind CSS v4.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
