import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  // In a real app, you'd save to database and hash the password
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    balance: 0,
    tier: "unemployed" as const,
    subscription: false,
  }

  return NextResponse.json(newUser)
}
