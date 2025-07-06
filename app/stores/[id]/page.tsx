import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag, ArrowLeft, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

async function getStore(id: string) {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          category: true,
        },
        orderBy: { views: "desc" },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export default async function StorePage({ params }: { params: { id: string } }) {
  const store = await getStore(params.id)

  if (!store) {
    notFound()
  }

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
              <Link href="/stores">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stores
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="mb-8">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
            <Image
              src={store.banner || "/placeholder.svg?height=400&width=1200"}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-start space-x-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
              <Image
                src={store.logo || "/placeholder.svg?height=96&width=96"}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">Local Store</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground ml-1">4.8 (124 reviews)</span>
                </div>
                <Badge variant="secondary">{store.products.length} Products</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                {store.description || "Welcome to our store! Discover amazing products."}
              </p>
              <div className="text-sm text-muted-foreground">Owned by {store.user.name}</div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products from {store.name}</h2>

          {store.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {store.products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
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
                      <Badge variant="secondary">{product.category.name}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground ml-1">4.5</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-1">{product.title}</CardTitle>
                    <CardDescription className="mb-3 line-clamp-2">{product.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${product.price}</span>
                      <Button size="sm" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground">This store is still setting up their inventory.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
