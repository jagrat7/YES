"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { Activity, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Say YES to a stranger asking for directions",
    description: "Help someone who looks lost and take a selfie!",
    reward: 5,
    difficulty: "unemployed",
    completed: false,
    crazyLevel: 1,
  },
  {
    id: "2",
    title: "Try a new food you've never eaten",
    description: "Order something completely random from a menu",
    reward: 15,
    difficulty: "easy",
    completed: false,
    crazyLevel: 2,
  },
  {
    id: "3",
    title: "Ask someone on a spontaneous adventure",
    description: "Invite a friend to do something crazy within 2 hours",
    reward: 50,
    difficulty: "daredevil",
    completed: false,
    crazyLevel: 3,
  },
  {
    id: "4",
    title: "Quit something you hate doing",
    description: "Finally say NO to something by saying YES to change",
    reward: 100,
    difficulty: "dont-care",
    completed: false,
    crazyLevel: 4,
  },
];

export function ActivityCompletion() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [crazyLevel, setCrazyLevel] = useState([3]);
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();


  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchActivity();
    } else {
      router.push("/auth");
    }
  }, [router]);

    useEffect(() => {
    const level = crazyLevel[0];
    const matchingActivity =
      mockActivities.find((a) => a.crazyLevel === level) ?? null;
    setCurrentActivity(matchingActivity);
  }, [crazyLevel]);

  const fetchActivity = async () => {
    const response = await fetch("/api/activities");
    const activities = await response.json();
    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];
    setCurrentActivity(randomActivity);
    // Automatically set the slider to match the activity's crazyLevel
    // if (randomActivity?.crazyLevel) {
    //   setCrazyLevel([randomActivity.crazyLevel]);
    // }
  };

  const completeActivity = async () => {
    if (!currentActivity || !user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: currentActivity.id,
          proof,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update user balance
        const updatedUser = { ...user, balance: user.balance + result.reward };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          fetchActivity();
          setProof("");
          setCrazyLevel([3]);
        }, 3000);
      }
    } catch (error) {
      console.error("Error completing activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCrazyText = (level: number) => {
    if (level <= 2) return "Quit something you dislike";
    if (level <= 4) return "Quit something that's dragging you down";
    if (level <= 6) return "Ditch something you absolutely hate";
    if (level <= 8) return "Walk away from that soul-sucking nightmare";
    return "Destroy the thing that's ruining your life";
  };


  if (!user) {
    return (
      <div className="text-center">Please log in to access challenges...</div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="text-center">Loading your next YES adventure...</div>
    );
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl border-4 border-black p-8 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">YES! Well Done!</h3>
            <p className="text-lg mb-4">
              You earned ${currentActivity?.reward}!
            </p>
            <p className="text-sm text-gray-600">
              Getting your next challenge...
            </p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-3xl border-4 border-black p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Current Challenge</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-2xl font-bold text-green-600">${user.balance}</p>
          </div>
        </div>

        <Card className="border-2 border-black rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">
            {currentActivity.title}
          </h3>

          <p className="text-gray-700 mb-4">{currentActivity.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">
              Reward: ${currentActivity.reward}
            </span>
            <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium">
              {currentActivity.difficulty}
            </span>
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Level of Craziness
            </label>
            <Slider
              value={crazyLevel}
              onValueChange={setCrazyLevel}
              max={4}
              min={1}
              step={1}
              className="mb-2"
            />
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
              onClick={completeActivity}
              variant="outline"
              className="border-2 border-black rounded-xl font-bold py-3 px-6 transform hover:scale-105 transition-transform bg-transparent"
            >
              YES!
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Proof / Share Your Story
            </label>
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
    </>
  );
}
