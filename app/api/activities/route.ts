import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

// Configure OpenAI to use OpenRouter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Simple in-memory cache for activities by tier
let activityCache: { [tier: string]: { activities: any[], timestamp: number } } = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function generateActivities(tier: string = "all"): Promise<any[]> {
  const now = Date.now()
  
  // Return cached activities if they're still fresh
  if (activityCache[tier] && (now - activityCache[tier].timestamp) < CACHE_DURATION) {
    console.log('Returning cached activities for tier:', tier)
    return activityCache[tier].activities
  }
  try {
    console.log(`Generating new activities for tier: ${tier}`)
    
    const getTierPrompt = (tierType: string) => {
      switch (tierType) {
        case "easy":
          return {
            count: 10,
            description: "EASY TIER (10 activities):",
            distribution: `- 3 activities with crazyLevel: 1 (reward: $15-20)
            - 4 activities with crazyLevel: 2 (reward: $18-23)
            - 3 activities with crazyLevel: 3 (reward: $20-25)`,
            difficulty: "easy",
            examples: "Try new food, compliment stranger, take a different route home"
          };
        case "daredevil":
          return {
            count: 10,
            description: "DAREDEVIL TIER (10 activities):",
            distribution: `- 3 activities with crazyLevel: 4 (reward: $50-60)
            - 4 activities with crazyLevel: 5 (reward: $55-65)
            - 3 activities with crazyLevel: 6 (reward: $60-75)`,
            difficulty: "daredevil",
            examples: "Public speaking, ask someone out, start a conversation with 5 strangers"
          };
        case "dont-care":
          return {
            count: 10,
            description: "DONT-CARE TIER (10 activities):",
            distribution: `- 2 activities with crazyLevel: 7 (reward: $100-200)
            - 3 activities with crazyLevel: 8 (reward: $150-300)
            - 3 activities with crazyLevel: 9 (reward: $200-400)
            - 2 activities with crazyLevel: 10 (reward: $300-500)`,
            difficulty: "dont-care",
            examples: "Quit toxic job, move to new city, start that business idea"
          };
        default:
          return {
            count: 30,
            description: "ALL TIERS (30 activities):",
            distribution: `**EASY TIER (10 activities):**
            - 3 activities with crazyLevel: 1 (reward: $15-20)
            - 4 activities with crazyLevel: 2 (reward: $18-23)
            - 3 activities with crazyLevel: 3 (reward: $20-25)
            
            **DAREDEVIL TIER (10 activities):**
            - 3 activities with crazyLevel: 4 (reward: $50-60)
            - 4 activities with crazyLevel: 5 (reward: $55-65)
            - 3 activities with crazyLevel: 6 (reward: $60-75)
            
            **DONT-CARE TIER (10 activities):**
            - 2 activities with crazyLevel: 7 (reward: $100-200)
            - 3 activities with crazyLevel: 8 (reward: $150-300)
            - 3 activities with crazyLevel: 9 (reward: $200-400)
            - 2 activities with crazyLevel: 10 (reward: $300-500)`,
            difficulty: "mixed",
            examples: "Mix of all difficulty levels"
          };
      }
    };

    const tierConfig = getTierPrompt(tier);
    
    const { object: activities } = await generateObject({
      model: openrouter("openai/gpt-4o"),
      schema: z.object({
        activities: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            reward: z.number(),
            difficulty: z.string(),
            completed: z.boolean(),
            crazyLevel: z.number().min(1).max(10),
          })
        ),
      }),
      prompt: `Generate ${tierConfig.count} creative "YES" challenge activities for a life-changing app. Each activity should encourage users to step out of their comfort zone and say YES to new experiences.
            
            ${tierConfig.description}
            ${tierConfig.distribution}
            - difficulty: "${tierConfig.difficulty}"
            - Examples: ${tierConfig.examples}
            
            Make them fun, engaging, and progressively more adventurous. Include social challenges, personal growth tasks, creative activities, and spontaneous adventures. Each should have a clear, actionable title and motivating description.
            
            Distribute crazyLevel evenly within the specified range.`,
    });

    console.log('Generated new activities:', JSON.stringify(activities, null, 2))
    
    // Cache the generated activities for this tier
    activityCache[tier] = {
      activities,
      timestamp: now
    }
    
    return activities
  } catch (error) {
    console.error("Failed to generate activities:", error)
    return []
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get('tier') || 'all'
  
  const activities = await generateActivities(tier) 
  return NextResponse.json(activities)
}

export async function POST(request: Request) {
  const { activityId, proof, tier } = await request.json()

  // Get current activities and mark as completed
  const activities = await generateActivities(tier || 'all') 
  const activity = activities?.find((a) => a.id === activityId)
  if (activity) {
    activity.completed = true
    activity.proof = proof
  }

  return NextResponse.json({ success: true, reward: activity?.reward || 0 })
}
