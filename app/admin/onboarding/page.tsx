"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShoppingBag } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function StoreOnboarding() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        const data = await response.json()
        setError(data.error || "An error occurred")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-2xl py-8">
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">EcoStore</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Up Your Store</CardTitle>
            <CardDescription>Let's get your store ready for customers. Fill in the details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your store name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your store sells..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Upload your logo to a service like Imgur or use a direct URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  placeholder="https://example.com/banner.png"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Upload your banner image to a service like Imgur or use a direct URL
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Store
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
