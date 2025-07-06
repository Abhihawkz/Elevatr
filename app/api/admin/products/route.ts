import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, price, image, stock, categoryId } = await request.json()

    // Get user's store
    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        image,
        stock: Number.parseInt(stock),
        storeId: store.id,
        categoryId,
      },
      include: {
        category: true,
        store: true,
      },
    })

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
