"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Activity, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { i, id, init, InstaQLEntity } from "@instantdb/react";

const APP_ID = "f71273bb-9acd-4bd8-82f7-e9346fbca877";

const schema = i.schema({
  entities: {
    tierSelection: i.entity({
      selectedTierId: i.string(),
    }),
  },
});

const db = init({ appId: APP_ID, schema });

export function ActivityCompletion() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tierActivities, setTierActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userTier, setUserTier] = useState<string>("unemployed");
  const [crazyLevel, setCrazyLevel] = useState([3]);
  const [proof, setProof] = useState(""); // can be text or base64 image string
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);
  const router = useRouter();
  const { isLoading, error, data } = db.useQuery({ "tierSelection": {
    "$": {
      "limit": 1
    }
  } });

  console.log(data?.tierSelection?.[0]?.selectedTierId);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Create default guest user if none exists
      const defaultUser = {
        id: "guest",
        name: "Guest User",
        email: "guest@example.com",
        balance: 0,
        tier: "unemployed" as const,
        subscription: false,
      };
      localStorage.setItem("user", JSON.stringify(defaultUser));
      setUser(defaultUser);
    }

    // Get user's selected tier from localStorage
    const selectedTier = data?.tierSelection?.[0]?.selectedTierId || "unemployed";
    setUserTier(selectedTier);

    // Set initial crazy level to middle of slider (5 out of 10)
    if (selectedTier !== "unemployed") {
      setCrazyLevel([5]);
    }
  }, [data?.tierSelection, router]);

  // Fetch activities when userTier changes
  useEffect(() => {
    if (userTier) {
      fetchActivity();
    }
  }, [userTier]);

  useEffect(() => {
    if (activities.length > 0) {
      if (userTier === "unemployed") {
        // Unemployed tier: random activity with random crazy level
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setCurrentActivity(randomActivity);
      } else {
        // Paid tiers: filter activities by tier, then find matching crazy level
        const tierActivities = getFilteredActivities(activities, userTier);
        const mappedLevel = mapSliderToCrazyLevel(crazyLevel[0], userTier);
        const matchingActivities = tierActivities.filter((a) => a.crazyLevel === mappedLevel);
        const selectedActivity = matchingActivities.length > 0
          ? matchingActivities[Math.floor(Math.random() * matchingActivities.length)]
          : tierActivities[0];
        setCurrentActivity(selectedActivity);
      }
    }
  }, [crazyLevel, activities, userTier]);

  const fetchActivity = async () => {
    try {
      setLoadingActivities(true);
      // Pass user's tier to get tier-specific activities
      console.log('Current userTier:', userTier);
      const tierParam = userTier === "unemployed" ? "all" : userTier;
      console.log('Fetching activities for tier:', tierParam);
      const response = await fetch(`/api/activities?tier=${tierParam}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedActivities = await response.json();
      console.log('Fetched activities:', fetchedActivities);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const completeActivity = async () => {
    if (!currentActivity || !user) return;

    setLoading(true);
    try {
      // First verify the proof (image or text)
      const verificationResponse = await fetch("/api/verify-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: proof.startsWith("data:image/") ? proof : null,
          activityTitle: currentActivity.title,
          activityDescription: currentActivity.description,
          proof: proof.startsWith("data:image/") ? "" : proof,
          // Send complete challenge data for better verification
          challenge: {
            id: currentActivity.id,
            title: currentActivity.title,
            description: currentActivity.description,
            crazyLevel: currentActivity.crazyLevel,
            difficulty: currentActivity.difficulty,
            reward: currentActivity.reward,
          },
          userTier,
          crazyLevel: crazyLevel[0],
        }),
      });

      const verification = await verificationResponse.json();
      console.log('🔍 Verification result:', verification);

      if (!verification.verified) {
        setVerificationMessage(verification.reason || "Challenge verification failed");
        setShowFailure(true);
     
        return;
      }

      // If verified, show success and simulate earning reward
      setShowSuccess(true);


    } catch (error) {
      console.error("Error completing activity:", error);
      alert("❌ Failed to complete activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (level: number) => {
    if (level <= 3) return { name: "Easy", description: "Low commitment, fun challenges", color: "bg-green-100 text-green-800" };
    if (level <= 6) return { name: "Daredevil", description: "Bold, exciting tasks", color: "bg-orange-100 text-orange-800" };
    return { name: "I Don't Care", description: "Extreme, life-changing challenges", color: "bg-red-100 text-red-800" };
  };

  const getCrazyText = (level: number) => {
    if (level <= 3) return "Fun and manageable";
    if (level <= 6) return "Getting adventurous";
    if (level <= 8) return "Seriously bold";
    return "Absolutely insane";
  };

  // Get tier-specific slider settings - all tiers have 10 steps
  const getTierSliderSettings = (tier: string) => {
    switch (tier) {
      case "easy":
        return { max: 10, crazyLevelRange: [1, 3], label: "Easy Tier (1-3)" };
      case "daredevil":
        return { max: 10, crazyLevelRange: [4, 6], label: "Daredevil Tier (4-6)" };
      case "dont-care":
        return { max: 10, crazyLevelRange: [7, 10], label: "Don't Care Tier (7-10)" };
      default:
        return { max: 10, crazyLevelRange: [1, 3], label: "Easy Tier (1-3)" };
    }
  };

  // Map slider position (1-10) to actual crazyLevel for the tier
  const mapSliderToCrazyLevel = (sliderValue: number, tier: string) => {
    const settings = getTierSliderSettings(tier);
    const [minLevel, maxLevel] = settings.crazyLevelRange;
    const levelRange = maxLevel - minLevel;
    const mappedLevel = minLevel + Math.floor((sliderValue - 1) * levelRange / 9);
    return Math.min(mappedLevel, maxLevel);
  };

  // Filter activities based on tier
  const getFilteredActivities = (allActivities: Activity[], tier: string) => {
    if (tier === "unemployed") {
      return allActivities; // Unemployed gets random from all
    }
    const { crazyLevelRange } = getTierSliderSettings(tier);
    const [minLevel, maxLevel] = crazyLevelRange;
    return allActivities.filter(a => a.crazyLevel >= minLevel && a.crazyLevel <= maxLevel);
  };

  // Handle file input change - upload image only
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG and JPEG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProof(reader.result as string); // set base64 image string
    };
    reader.readAsDataURL(file);
  };

  // Handle text input change - clear image proof if any
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    // If proof is currently an image, clear it before setting text
    if (proof.startsWith("data:image/")) {
      setProof("");
    }
    setProof(text);
  };

  if (!user) {
    return (
      <div className="text-center">Please log in to access challenges...</div>
    );
  }

  if (loadingActivities || !currentActivity) {
    return (
      <div className="text-center">Loading your next YES adventure...</div>
    );
  }

  return (
    <>
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl border-4 border-black max-w-md">
          <DialogHeader>
            <div className="text-6xl mb-4 text-center">🎉</div>
            <DialogTitle className="text-2xl font-bold text-center">YES! Well Done!</DialogTitle>
            <DialogDescription className="text-lg text-center">
              You earned ${currentActivity?.reward}!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showFailure} onOpenChange={setShowFailure}>
        <DialogContent className="rounded-3xl border-4 border-black max-w-md">
          <DialogHeader>
            <div className="text-6xl mb-4 text-center">❌</div>
            <DialogTitle className="text-2xl font-bold text-center">Verification Failed</DialogTitle>
            <DialogDescription className="text-lg text-gray-700 text-center">
              {verificationMessage}
            </DialogDescription>
            <p className="text-sm text-gray-500 text-center mt-2">
              Please try again with better proof of completing the challenge.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="bg-white rounded-3xl border-4 border-black p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Current Challenge</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-2xl font-bold text-green-600">${user.balance}</p>
          </div>
        </div>

        <Card className="border-2 border-black rounded-2xl mb-6 relative overflow-hidden h-[400px] flex flex-col" style={{ backgroundImage: `url(/${currentActivity.id.length % 2 === 0 ? 's2' : 's3'}.gif)`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl"></div>
          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">{currentActivity.title}</h3>
              <p className="text-gray-700 mb-4">{currentActivity.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">
                Reward: <span className="text-green-600">${currentActivity.reward}</span>
              </span>
              <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium text-blue-800">
                {currentActivity.difficulty}
              </span>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {userTier === "unemployed" ? (
            <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-2">🎲 Unemployed Tier - Random Challenge</h3>
              <p className="text-sm text-gray-600">
                You're on the free tier! We pick random challenges for you with surprise rewards.
                Upgrade to a paid tier to control your adventure level.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-1">
                  {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier - {getTierSliderSettings(userTier).label}
                </h3>
                <p className="text-xs text-blue-700">
                  {getFilteredActivities(activities, userTier).length} activities available • Slider: {crazyLevel[0]}/10 → Level: {mapSliderToCrazyLevel(crazyLevel[0], userTier)}
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Level of Craziness ({getCrazyText(crazyLevel[0])})
                </label>
                {currentActivity && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierInfo(currentActivity.crazyLevel).color}`}>
                    {getTierInfo(currentActivity.crazyLevel).name} Tier
                  </span>
                )}
              </div>
              <Slider
                value={crazyLevel}
                onValueChange={setCrazyLevel}
                max={getTierSliderSettings(userTier).max}
                min={1}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Boooring</span>
                <span>Insane</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Proof
            </label>

            {/* <Textarea
              value={proof.startsWith("data:image/") ? "" : proof}
              onChange={handleTextChange}
              placeholder="Tell us how it went! Upload a photo link or describe your YES moment..."
              className="border-2 border-black rounded-xl"
              rows={4}
              disabled={proof.startsWith("data:image/")}
            /> */}

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="mt-2"
            />

            {proof.startsWith("data:image/") && (
              <div className="mt-4">
                <img
                  src={proof}
                  alt="Uploaded proof with img"
                  className="max-h-48 rounded-xl border-2 border-black"
                />
                <Button
                  variant="outline"
                  onClick={() => setProof("")}
                  className="mt-2"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={completeActivity}
              disabled={loading || !proof || proof.length === 0}
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
        </div>
      </div>
    </>
  );
}
