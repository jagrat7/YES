import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

// Configure OpenAI to use OpenRouter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Cache variables
let cachedActivities: any[] | null = null
let lastGenerated = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function generateActivities() {
  const now = Date.now()
  
  // Return cached activities if they're still fresh
  if (cachedActivities && (now - lastGenerated) < CACHE_DURATION) {
    console.log('Returning cached activities')
    return cachedActivities
  }
  try {
    const { object: { activities } } = await generateObject({
      model: openrouter("openai/gpt-4o"),
      schema: z.object({
        activities: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            reward: z.number(),
            difficulty: z.enum(["unemployed", "easy", "daredevil", "dont-care"]),
            completed: z.boolean(),
            crazyLevel: z.number().min(1).max(10),
          })
        ),
      }),
      prompt: `Generate 12 creative "YES" challenge activities for a life-changing app. Each activity should encourage users to step out of their comfort zone and say YES to new experiences.
            Create activities across 4 difficulty tiers:
            - unemployed (crazyLevel 1-2): Free, safe, simple tasks with $5-10 rewards
            - easy (crazyLevel 3-4): Low commitment, fun challenges with $15-25 rewards  
            - daredevil (crazyLevel 5-7): Bold, exciting tasks with $50-75 rewards
            - dont-care (crazyLevel 8-10): Extreme, life-changing challenges with $100-500 rewards

            Make them fun, engaging, and progressively more adventurous. Include social challenges, personal growth tasks, creative activities, and spontaneous adventures. Each should have a clear, actionable title and motivating description.

            Generate 3 activities per tier (12 total).`,
    });

    console.log('Generated new activities:', JSON.stringify(activities, null, 2))
    
    // Cache the generated activities
    cachedActivities = activities
    lastGenerated = now
    
    return cachedActivities
  } catch (error) {
    console.error("Failed to generate activities:", error)
    return []
  }
}


export async function GET() {
  const activities = await generateActivities() 
  return NextResponse.json(activities)
}

export async function POST(request: Request) {
  const { activityId, proof } = await request.json()

  // Get current activities and mark as completed
  const activities = await generateActivities() 
  const activity = activities?.find((a) => a.id === activityId)
  if (activity) {
    activity.completed = true
    activity.proof = proof
  }

  return NextResponse.json({ success: true, reward: activity?.reward || 0 })
}
