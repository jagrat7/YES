import { NextResponse } from "next/server"

const mockUser = {
  id: "1",
  name: "Yes Person",
  balance: 25,
  tier: "easy" as const,
  subscription: true,
}

export async function GET() {
  return NextResponse.json(mockUser)
}

export async function POST(request: Request) {
  const { reward } = await request.json()
  mockUser.balance += reward
  return NextResponse.json(mockUser)
}
