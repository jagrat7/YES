import { NextResponse } from "next/server"

const mockActivities = [
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
]

export async function GET() {
  return NextResponse.json(mockActivities)
}

export async function POST(request: Request) {
  const { activityId, proof } = await request.json()

  // Mock completion logic
  const activity = mockActivities.find((a) => a.id === activityId)
  if (activity) {
    activity.completed = true
    activity.proof = proof
  }

  return NextResponse.json({ success: true, reward: activity?.reward || 0 })
}
