"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { i, id, init, InstaQLEntity } from "@instantdb/react";

const APP_ID = "f71273bb-9acd-4bd8-82f7-e9346fbca877";

const schema = i.schema({
  entities: {
    tierSelection: i.entity({
      selectedTierId: i.string(),
    }),
  },
});

type TierSelection = InstaQLEntity<typeof schema, "tierSelection">;

const db = init({ appId: APP_ID, schema });
const room = db.room("tierSelection");

const tiers = [
  {
    id: "unemployed",
    title: "Unemployed Tier",
    icon: "🎲",
    description: "We pick the craziness for you!",
    features: ["Random challenges", "No choice in difficulty", "Surprise rewards", "Completely free!"],
    color: "bg-gray-50 border-gray-300 hover:bg-gray-100",
    reward: "FREE",
    popular: false,
  },
  {
    id: "easy",
    title: "Easy Money",
    icon: "💰",
    description: "Perfect starter tier - good pay!",
    features: ["Fun challenges", "Low commitment", "$5-15 rewards per challenge", "Most popular choice"],
    color: "bg-green-50 border-green-300 hover:bg-green-100",
    reward: "$30",
    popular: true,
  },
  {
    id: "daredevil",
    title: "Daredevil",
    icon: "🔥",
    description: "Bold & exciting",
    features: ["Thrilling tasks", "Higher stakes", "$25-50 rewards per challenge", "Adrenaline rush"],
    color: "bg-orange-50 border-orange-300 hover:bg-orange-100",
    reward: "$75",
    popular: false,
  },
  {
    id: "dont-care",
    title: "I Don't Care Anymore",
    icon: "🤯",
    description: "EXTREME TIER - Premium membership!",
    features: ["Life-altering challenges", "$100-500 rewards per challenge", "Absolutely no limits", "For the truly fearless"],
    color: "bg-red-100 border-red-400 hover:bg-red-200",
    reward: "$500",
    popular: false,
  },
];

export function TierCards() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTierForConfirm, setSelectedTierForConfirm] = useState<string | null>(null);
  const router = useRouter();
  
  // Query for tierSelection entities (there should be only one)
  const { isLoading, error, data } = db.useQuery({ tierSelection: {} });

  // Handler to show confirmation dialog
  function handleTierSelection(tierId: string) {
    setSelectedTierForConfirm(tierId);
    setShowConfirmDialog(true);
  }

  // Handler to confirm tier selection
  function confirmTierSelection() {
    if (!selectedTierForConfirm) return;
    
    const current = data?.tierSelection?.[0];
    if (current) {
      // Update existing record
      db.transact(db.tx.tierSelection[current.id].update({ selectedTierId: selectedTierForConfirm }));
    } else {
      // Create new record
      db.transact(db.tx.tierSelection[id()].update({ selectedTierId: selectedTierForConfirm }));
    }
    
    setShowConfirmDialog(false);
    setSelectedTierForConfirm(null);
    
    // Redirect to challenge page
    router.push('/challenge');
  }

  if (isLoading) return <p>Loading tiers...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // Get selectedTierId from data (first entity)
  const selectedTierId = data?.tierSelection?.[0]?.selectedTierId;

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Adventure Level</h2>
        <p className="text-gray-600">Pick the tier that matches your courage level!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`${tier.color} border-2 ${
              tier.reward === "$500" ? "border-red-500 shadow-red-200 shadow-lg" : "border-black"
            } rounded-2xl p-6 min-h-[320px] flex flex-col relative transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
              selectedTierId === tier.id ? "ring-4 ring-black" : ""
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{tier.icon}</div>
              <h3 className="font-bold text-xl mb-2">{tier.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
            </div>

            <div className="text-center mb-6">
              <div
                className={`text-3xl font-bold mb-1 ${
                  tier.reward === "FREE" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {tier.reward}
              </div>
              <p className="text-xs text-gray-500">
                {tier.reward === "FREE" ? "no payment required" : "per month"}
              </p>
            </div>

            <div className="flex-1">
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full p-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors duration-200"
              onClick={() => handleTierSelection(tier.id)}
            >
              Choose {tier.id === "dont-care" ? "to not care anymore" : tier.title}
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
        <p className="text-sm text-gray-600">
          📝 <strong>Note:</strong> You can switch tiers anytime! Start small and work your way up to bigger challenges.
        </p>
      </div>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="rounded-3xl border-4 border-black max-w-md">
          <DialogHeader>
            <div className="text-6xl mb-4 text-center">🎯</div>
            <DialogTitle className="text-2xl font-bold text-center">Confirm Tier Selection</DialogTitle>
            <DialogDescription className="text-lg text-center">
              Are you sure you want to select the <strong>{tiers.find(t => t.id === selectedTierForConfirm)?.title}</strong> tier?
            </DialogDescription>
            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 border-2 border-gray-300 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmTierSelection}
                className="flex-1 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold"
              >
                YES! Start My Challenges →
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
