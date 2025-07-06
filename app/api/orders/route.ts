import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, productId, quantity, total } =
      await request.json()

    // Verify product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        total: Number.parseFloat(total),
        userId: "guest", // For guest orders
        orderItems: {
          create: {
            productId,
            quantity: Number.parseInt(quantity),
            price: product.price,
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    })

    return NextResponse.json({ message: "Order created successfully", order }, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
