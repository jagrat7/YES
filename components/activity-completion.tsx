"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import type { Activity, User } from "@/lib/types"

export function ActivityCompletion() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [crazyLevel, setCrazyLevel] = useState([3])
  const [proof, setProof] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchActivity()
  }, [])

  const fetchUser = async () => {
    const response = await fetch("/api/user")
    const userData = await response.json()
    setUser(userData)
  }

  const fetchActivity = async () => {
    const response = await fetch("/api/activities")
    const activities = await response.json()
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    setCurrentActivity(randomActivity)
  }

  const completeActivity = async () => {
    if (!currentActivity) return

    setLoading(true)
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: currentActivity.id,
          proof,
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reward: result.reward }),
        })

        fetchUser()
        fetchActivity()
        setProof("")
        setCrazyLevel([3])
      }
    } catch (error) {
      console.error("Error completing activity:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentActivity || !user) {
    return <div className="text-center">Loading your next YES adventure...</div>
  }

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Current Challenge</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Your Balance</p>
          <p className="text-2xl font-bold text-green-600">${user.balance}</p>
        </div>
      </div>

      <Card className="border-2 border-black rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-2">{currentActivity.title}</h3>
        <p className="text-gray-700 mb-4">{currentActivity.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Reward: ${currentActivity.reward}</span>
          <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium">{currentActivity.difficulty}</span>
        </div>
      </Card>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Level of Craziness</label>
          <Slider value={crazyLevel} onValueChange={setCrazyLevel} max={10} min={1} step={1} className="mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Boring</span>
            <span>INSANE!</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={completeActivity}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl border-2 border-black transform hover:scale-105 transition-transform"
          >
            {loading ? "Processing..." : "YES!"}
          </Button>
          <Button
            onClick={fetchActivity}
            variant="outline"
            className="border-2 border-black rounded-xl font-bold py-3 px-6 transform hover:scale-105 transition-transform bg-transparent"
          >
            YES! (New Challenge)
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload Proof / Share Your Story</label>
          <Textarea
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Tell us how it went! Upload a photo link or describe your YES moment..."
            className="border-2 border-black rounded-xl"
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
