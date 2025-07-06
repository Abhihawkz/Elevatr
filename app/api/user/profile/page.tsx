import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone } = await request.json()

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
      },
    })

    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
