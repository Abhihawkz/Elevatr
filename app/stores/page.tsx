import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Search, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

async function getStores() {
  return await prisma.store.findMany({
    include: {
      products: {
        take: 3,
        orderBy: { views: "desc" },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function StoresPage() {
  const stores = await getStores()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EcoStore</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Local Stores</h1>
          <p className="text-muted-foreground mb-6">
            Browse through our collection of verified local stores and discover unique products
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search stores..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={store.banner || "/placeholder.svg?height=200&width=400"}
                    alt={store.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={store.logo || "/placeholder.svg?height=48&width=48"}
                      alt={store.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      Local Store
                    </div>
                  </div>
                </div>

                <CardDescription className="mb-4 line-clamp-2">
                  {store.description || "Discover amazing products from this store"}
                </CardDescription>

                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{store._count.products} Products</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">4.8</span>
                  </div>
                </div>

                {/* Sample Products */}
                {store.products.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Popular Products:</p>
                    <div className="flex space-x-2">
                      {store.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg?height=48&width=48"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full" asChild>
                  <Link href={`/stores/${store.id}`}>Visit Store</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No stores found</h3>
            <p className="text-muted-foreground">Be the first to open a store on our platform!</p>
            <Button className="mt-4" asChild>
              <Link href="/auth/signup">Open Your Store</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
