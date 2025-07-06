import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserHeader } from "@/components/user-header"
import { ProfileForm } from "@/components/profile-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "USER") {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <ProfileForm user={session.user} />
      </main>
    </div>
  )
}
