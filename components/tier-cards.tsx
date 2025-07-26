import { Card } from "@/components/ui/card"

const tiers = [
  {
    id: "unemployed",
    title: "unemployed tier",
    description: "Safe & simple tasks",
    color: "bg-blue-50 border-blue-300",
    reward: "$5-10",
  },
  {
    id: "easy",
    title: "easy $50",
    description: "Slightly adventurous",
    color: "bg-green-50 border-green-300",
    reward: "$15-25",
  },
  {
    id: "daredevil",
    title: "daredevil",
    description: "Bold & exciting",
    color: "bg-orange-50 border-orange-300",
    reward: "$50-75",
  },
  {
    id: "dont-care",
    title: "i dont care",
    description: "Life-changing chaos",
    color: "bg-red-50 border-red-300",
    reward: "$100+",
  },
]

export function TierCards() {
  return (
    <div className="bg-white rounded-3xl border-4 border-black p-8 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`${tier.color} border-2 border-black rounded-2xl p-6 min-h-[150px] flex flex-col justify-between`}
          >
            <div>
              <h3 className="font-bold text-lg mb-2">{tier.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
            </div>
            <p className="font-bold text-green-600">{tier.reward}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
