export interface Activity {
  id: string
  title: string
  description: string
  reward: number
  difficulty: "unemployed" | "easy" | "daredevil" | "dont-care"
  completed: boolean
  proof?: string
}

export interface User {
  id: string
  name: string
  balance: number
  tier: "unemployed" | "easy" | "daredevil" | "dont-care"
  subscription: boolean
}
