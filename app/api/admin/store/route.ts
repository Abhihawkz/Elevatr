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

    const { name, description, logo, banner } = await request.json()

    // Check if store already exists for this user
    const existingStore = await prisma.store.findUnique({
      where: { userId: session.user.id },
    })

    if (existingStore) {
      return NextResponse.json({ error: "Store already exists" }, { status: 400 })
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        name,
        description,
        logo,
        banner,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Store created successfully", store }, { status: 201 })
  } catch (error) {
    console.error("Store creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
