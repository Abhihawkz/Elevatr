import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id

    // Verify the product belongs to the user's store
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          userId: session.user.id,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id
    const { title, description, price, image, stock, categoryId } = await request.json()

    // Verify the product belongs to the user's store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          userId: session.user.id,
        },
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        image,
        stock: Number.parseInt(stock),
        categoryId,
      },
      include: {
        category: true,
        store: true,
      },
    })

    return NextResponse.json({ message: "Product updated successfully", product }, { status: 200 })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id

    // Verify the product belongs to the user's store
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          userId: session.user.id,
        },
      },
      include: {
        category: true,
        store: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
