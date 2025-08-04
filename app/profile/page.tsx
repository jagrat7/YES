"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, Trophy, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User as UserType } from "@/lib/types"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedTier, setSelectedTier] = useState<string>("unemployed")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Create default guest user if none exists
      const defaultUser = {
        id: "guest",
        name: "Guest User",
        email: "guest@example.com",
        balance: 0,
        tier: "unemployed" as const,
        subscription: false,
      }
      localStorage.setItem("user", JSON.stringify(defaultUser))
      setUser(defaultUser)
    }
    
    // Get selected tier from localStorage
    const tierData = localStorage.getItem("selectedTier")
    if (tierData) {
      setSelectedTier(tierData)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "unemployed":
        return "bg-blue-100 text-blue-800"
      case "easy":
        return "bg-green-100 text-green-800"
      case "daredevil":
        return "bg-orange-100 text-orange-800"
      case "dont-care":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Navigation />
          <div className="text-center mt-20">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        <Navigation />

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 transform -rotate-1">Your YES! Profile 👤</h1>
          <p className="text-lg text-gray-700">Track your progress and manage your account</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <Card className="border-4 border-black rounded-3xl">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-black">
                <AvatarFallback className="text-2xl font-bold bg-yellow-200">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <Badge className={`${getTierColor(user.tier)} border-2 border-black rounded-full px-4 py-1`}>
                {user.tier} tier
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">${user.balance}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold">Subscription Status</p>
                  <Badge className={user.subscription ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {user.subscription ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Member Since</p>
                  <p className="text-gray-600">January 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-4 border-black rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl">Your YES! Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-2xl border-2 border-black">
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600">Challenges Completed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-2xl border-2 border-black">
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-2xl border-2 border-black">
                  <p className="text-2xl font-bold text-blue-600">$245</p>
                  <p className="text-sm text-gray-600">Total Earned</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl border-2 border-black">
                  <p className="text-2xl font-bold text-purple-600">8.5</p>
                  <p className="text-sm text-gray-600">Avg Crazy Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="border-4 border-black rounded-3xl mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => router.push("/tier-cards")} className="border-2 border-black rounded-xl bg-transparent">
                Change Tier
              </Button>
              <Button variant="outline" className="border-2 border-black rounded-xl bg-transparent">
                View History
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="border-2 border-black rounded-xl ml-auto">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
