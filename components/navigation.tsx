"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Target, User, LogIn } from "lucide-react"
import { useState, useEffect } from "react"
import type { User as UserType } from "@/lib/types"

export function Navigation() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <nav className="bg-white rounded-2xl border-2 border-black p-4 mb-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-yellow-600">
          Yes! 🎯
        </Link>

        <div className="flex gap-2 items-center">
          <Button asChild variant="outline" className="border-2 border-black rounded-xl bg-transparent">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild className="bg-yellow-600 hover:bg-yellow-700 border-2 border-black rounded-xl">
            <Link href="/challenge">
              <Target className="mr-2 h-4 w-4" />
              Challenge
            </Link>
          </Button>

          {user ? (
            <Button asChild variant="outline" className="border-2 border-black rounded-xl bg-transparent">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                {user.name}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-2 border-black rounded-xl bg-transparent">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
