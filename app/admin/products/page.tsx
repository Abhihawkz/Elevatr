import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin-header"
import { ProductsTable } from "@/components/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getProducts(userId: string) {
  const store = await prisma.store.findUnique({
    where: { userId },
  })

  if (!store) return []

  return await prisma.product.findMany({
    where: { storeId: store.id },
    include: {
      category: true,
      orderItems: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const products = await getProducts(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <ProductsTable products={products} />
      </main>
    </div>
  )
}
