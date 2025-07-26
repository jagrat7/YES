import { NextResponse } from "next/server"

// Mock user database
const mockUsers = [
  {
    id: "1",
    name: "Yes Person",
    email: "yes@example.com",
    password: "password123",
    balance: 25,
    tier: "easy" as const,
    subscription: true,
  },
  {
    id: "2",
    name: "Adventure Seeker",
    email: "adventure@example.com",
    password: "adventure123",
    balance: 150,
    tier: "daredevil" as const,
    subscription: true,
  },
]

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
