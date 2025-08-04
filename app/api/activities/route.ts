import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

// Configure OpenAI to use OpenRouter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})


// OLD DYNAMIC ACTIVITY GENERATION CODE - COMMENTED OUT
// async function generateActivities(tier: string = "all"): Promise<any[]> {
//   try {
//     console.log(`Generating new activities for tier: ${tier}`)
//     
//     const getTierPrompt = (tierType: string) => {
//       switch (tierType) {
//         case "easy":
//           return {
//             count: 10,
//             description: "EASY TIER (10 activities):",
//             distribution: `- 3 activities with crazyLevel: 1 (reward: $15-20)
//             - 4 activities with crazyLevel: 2 (reward: $18-23)
//             - 3 activities with crazyLevel: 3 (reward: $20-25)`,
//             difficulty: "easy",
//             examples: "Try new food, compliment stranger, take a different route home"
//           };
//         case "daredevil":
//           return {
//             count: 10,
//             description: "DAREDEVIL TIER (10 activities):",
//             distribution: `- 3 activities with crazyLevel: 4 (reward: $50-60)
//             - 4 activities with crazyLevel: 5 (reward: $55-65)
//             - 3 activities with crazyLevel: 6 (reward: $60-75)`,
//             difficulty: "daredevil",
//             examples: "Public speaking, ask someone out, start a conversation with 5 strangers"
//           };
//         case "dont-care":
//           return {
//             count: 10,
//             description: "DONT-CARE TIER (10 activities):",
//             distribution: `- 2 activities with crazyLevel: 7 (reward: $100-200)
//             - 3 activities with crazyLevel: 8 (reward: $150-300)
//             - 3 activities with crazyLevel: 9 (reward: $200-400)
//             - 2 activities with crazyLevel: 10 (reward: $300-500)`,
//             difficulty: "dont-care",
//             examples: "Quit toxic job, move to new city, start that business idea"
//           };
//         default:
//           return {
//             count: 30,
//             description: "ALL TIERS (30 activities):",
//             distribution: `**EASY TIER (10 activities):**
//             - 3 activities with crazyLevel: 1 (reward: $15-20)
//             - 4 activities with crazyLevel: 2 (reward: $18-23)
//             - 3 activities with crazyLevel: 3 (reward: $20-25)
//             
//             **DAREDEVIL TIER (10 activities):**
//             - 3 activities with crazyLevel: 4 (reward: $50-60)
//             - 4 activities with crazyLevel: 5 (reward: $55-65)
//             - 3 activities with crazyLevel: 6 (reward: $60-75)
//             
//             **DONT-CARE TIER (10 activities):**
//             - 2 activities with crazyLevel: 7 (reward: $100-200)
//             - 3 activities with crazyLevel: 8 (reward: $150-300)
//             - 3 activities with crazyLevel: 9 (reward: $200-400)
//             - 2 activities with crazyLevel: 10 (reward: $300-500)`,
//             difficulty: "mixed",
//             examples: "Mix of all difficulty levels"
//           };
//       }
//     };

//     const tierConfig = getTierPrompt(tier);
//     
//     const { object } = await generateObject({
//       model: openrouter("openai/gpt-4o"),
//       schema: z.object({
//         activities: z.array(
//           z.object({
//             id: z.string(),
//             title: z.string(),
//             description: z.string(),
//             reward: z.number(),
//             difficulty: z.string(),
//             completed: z.boolean(),
//             crazyLevel: z.number().min(1).max(10),
//           })
//         ),
//       }),
//       prompt: `Generate ${tierConfig.count} creative "YES" challenge activities for a life-changing app. Each activity should encourage users to step out of their comfort zone and say YES to new experiences.
//             
//             ${tierConfig.description}
//             ${tierConfig.distribution}
//             - difficulty: "${tierConfig.difficulty}"
//             - Examples: ${tierConfig.examples}
//             
//             Make them fun, engaging, and progressively more adventurous. Include social challenges, personal growth tasks, creative activities, and spontaneous adventures. Each should have a clear, actionable title and motivating description.
//             
//             Distribute crazyLevel evenly within the specified range.`,
//     });

//     const activities = object.activities
//     console.log('Generated new activities:', JSON.stringify(activities, null, 2))
//     return activities
//     
//   } catch (error) {
//     console.error("Failed to generate activities:", error)
//     return []
//   }
// }

// NEW HARDCODED UNHINGED ACTIVITIES
async function generateActivities(tier: string = "all"): Promise<any[]> {
  console.log(`Getting hardcoded unhinged activities for tier: ${tier}`)
  
  const allActivities = [
    // EASY TIER (crazyLevel 1-3)
    {
      id: "chicken-outfit-grocery",
      title: "Dress up in a chicken outfit and go grocery shopping",
      description: "Put on a full chicken costume and casually shop for groceries like it's totally normal. Bonus points for asking where the chicken feed is.",
      reward: 18,
      difficulty: "easy",
      completed: false,
      crazyLevel: 1
    },
    {
      id: "backwards-day",
      title: "Wear all your clothes backwards for an entire day",
      description: "Shirt, pants, shoes - everything backwards. Go about your normal day and see how many people notice.",
      reward: 16,
      difficulty: "easy",
      completed: false,
      crazyLevel: 1
    },
    {
      id: "pirate-accent",
      title: "Speak only in pirate accent for 4 hours straight",
      description: "Ahoy matey! Talk like a pirate to everyone you meet. Order coffee, answer work calls, everything in pirate speak.",
      reward: 20,
      difficulty: "easy",
      completed: false,
      crazyLevel: 1
    },
    {
      id: "sock-puppet-meeting",
      title: "Bring a sock puppet to your next video meeting",
      description: "Introduce your sock puppet colleague and have them participate in the discussion. Keep a straight face.",
      reward: 22,
      difficulty: "easy",
      completed: false,
      crazyLevel: 2
    },
    {
      id: "invisible-dog-walk",
      title: "Walk an invisible dog around the neighborhood",
      description: "Use a leash with no dog. Stop for it to sniff things, pick up invisible poop, the whole routine.",
      reward: 19,
      difficulty: "easy",
      completed: false,
      crazyLevel: 2
    },
    {
      id: "elevator-opera",
      title: "Sing opera in an elevator with strangers",
      description: "Belt out a dramatic opera performance during your elevator ride. Take requests if anyone asks.",
      reward: 21,
      difficulty: "easy",
      completed: false,
      crazyLevel: 2
    },
    {
      id: "superhero-commute",
      title: "Wear a cape and superhero mask during your commute",
      description: "Full superhero mode on public transport. Strike heroic poses and help elderly people with their bags.",
      reward: 23,
      difficulty: "easy",
      completed: false,
      crazyLevel: 2
    },
    {
      id: "banana-phone",
      title: "Use a banana as a phone in public for 30 minutes",
      description: "Have full conversations on your banana phone. Get animated, argue with the person on the other end.",
      reward: 25,
      difficulty: "easy",
      completed: false,
      crazyLevel: 3
    },
    {
      id: "mime-trapped",
      title: "Pretend to be trapped in an invisible box at a busy intersection",
      description: "Full mime performance for at least 15 minutes. Really sell the invisible walls and ceiling.",
      reward: 24,
      difficulty: "easy",
      completed: false,
      crazyLevel: 3
    },
    {
      id: "dinosaur-museum",
      title: "Visit a museum while making dinosaur noises",
      description: "Roar, screech, and stomp through the exhibits. Explain to other visitors that you're translating for the displays.",
      reward: 25,
      difficulty: "easy",
      completed: false,
      crazyLevel: 3
    },

    // DAREDEVIL TIER (crazyLevel 4-6)
    {
      id: "flash-mob-solo",
      title: "Start a one-person flash mob in a crowded square",
      description: "Break into choreographed dance in the middle of a busy area. Try to get others to join your spontaneous performance.",
      reward: 55,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 4
    },
    {
      id: "proposal-stranger",
      title: "Fake propose to a random stranger (with their consent)",
      description: "Ask someone if they'd help you practice a proposal, then go all out with the performance in public.",
      reward: 58,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 4
    },
    {
      id: "news-reporter",
      title: "Pretend to be a news reporter covering mundane events",
      description: "Set up with a fake microphone and report live on someone walking their dog or buying coffee. Interview bystanders.",
      reward: 52,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 4
    },
    {
      id: "medieval-knight",
      title: "Dress as a medieval knight and challenge people to duels",
      description: "Full armor (or cardboard), challenge strangers to honorable combat with pool noodles. Speak in ye olde English.",
      reward: 62,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 5
    },
    {
      id: "backwards-restaurant",
      title: "Order an entire meal backwards at a restaurant",
      description: "Start with dessert, then main course, then appetizer. Eat everything in reverse order and explain your time-travel diet.",
      reward: 60,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 5
    },
    {
      id: "alien-tourist",
      title: "Pretend to be an alien tourist asking for directions to Earth landmarks",
      description: "Wear something space-y and ask people how to get to 'the large water container' (ocean) or 'the tall rock formations' (mountains).",
      reward: 58,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 5
    },
    {
      id: "shakespeare-starbucks",
      title: "Order coffee in Shakespearean English for a week",
      description: "'Prithee, good barista, might I procure a venti latte with oat milk?' Commit to the bit every single time.",
      reward: 65,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 5
    },
    {
      id: "human-statue",
      title: "Become a human statue in a public park for 2 hours",
      description: "Pick a pose and hold it. Only move when someone tips you. Bonus points for an elaborate costume.",
      reward: 70,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 6
    },
    {
      id: "time-traveler",
      title: "Convince people you're a time traveler from 1823",
      description: "Be amazed by modern technology, ask about the 'horseless carriages,' and warn people about events that already happened.",
      reward: 68,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 6
    },
    {
      id: "interpretive-dance-explanation",
      title: "Explain your job through interpretive dance only",
      description: "At a networking event or party, when asked what you do, respond only through dramatic interpretive dance.",
      reward: 72,
      difficulty: "daredevil",
      completed: false,
      crazyLevel: 6
    },

    // DONT-CARE TIER (crazyLevel 7-10)
    {
      id: "mayor-campaign",
      title: "Run for mayor of your city with a platform of mandatory nap time",
      description: "File the paperwork, make campaign posters, give speeches about the importance of afternoon naps for productivity.",
      reward: 150,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 7
    },
    {
      id: "cult-leader",
      title: "Start a cult worshipping household appliances",
      description: "Gather followers who believe toasters are divine. Hold ceremonies, write a holy book, the works. (Keep it harmless and fun!)",
      reward: 180,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 7
    },
    {
      id: "professional-wrestler",
      title: "Become a professional wrestler with a ridiculous persona",
      description: "Create a character, get training, and actually compete in local wrestling matches. Full commitment to the gimmick.",
      reward: 250,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 8
    },
    {
      id: "reality-tv-star",
      title: "Apply for every reality TV show possible",
      description: "Bachelor, Survivor, Big Brother, cooking shows - apply to them all with increasingly unhinged audition videos.",
      reward: 200,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 8
    },
    {
      id: "professional-mourner",
      title: "Become a professional mourner at strangers' funerals",
      description: "Offer your services to dramatically weep at funerals. Create elaborate backstories about your relationship to the deceased.",
      reward: 280,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 8
    },
    {
      id: "country-founder",
      title: "Declare your backyard an independent nation",
      description: "Create a constitution, currency, national anthem, and try to get diplomatic recognition from other countries.",
      reward: 350,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 9
    },
    {
      id: "alien-abduction-expert",
      title: "Become the world's leading expert on alien abductions",
      description: "Write books, give lectures, appear on documentaries. Develop increasingly elaborate theories about extraterrestrial encounters.",
      reward: 320,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 9
    },
    {
      id: "professional-line-waiter",
      title: "Start a business where you wait in lines for people",
      description: "Market yourself as a professional line-waiter. Wait for new iPhone releases, restaurant openings, anything with a line.",
      reward: 380,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 9
    },
    {
      id: "time-travel-tourism",
      title: "Start a time travel tourism company",
      description: "Sell 'time travel experiences' to historical periods. Use elaborate sets, costumes, and method acting to convince customers.",
      reward: 450,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 10
    },
    {
      id: "superhero-for-hire",
      title: "Become a real-life superhero for hire",
      description: "Create a costume, develop powers (skills), and offer superhero services. Fight crime, rescue cats, attend birthday parties.",
      reward: 500,
      difficulty: "dont-care",
      completed: false,
      crazyLevel: 10
    }
  ]

  // Filter activities based on tier
  const getActivitiesByTier = (tierType: string) => {
    switch (tierType) {
      case "easy":
        return allActivities.filter(activity => activity.crazyLevel >= 1 && activity.crazyLevel <= 3)
      case "daredevil":
        return allActivities.filter(activity => activity.crazyLevel >= 4 && activity.crazyLevel <= 6)
      case "dont-care":
        return allActivities.filter(activity => activity.crazyLevel >= 7 && activity.crazyLevel <= 10)
      default:
        return allActivities
    }
  }

  const filteredActivities = getActivitiesByTier(tier)
  console.log(`Returning ${filteredActivities.length} unhinged activities for tier: ${tier}`)
  
  return filteredActivities
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier') || 'all'
    console.log('API GET called with tier:', tier)
    
    const activities = await generateActivities(tier)
    console.log('API returning activities count:', activities.length)
    return NextResponse.json(activities)
  } catch (error) {
    console.error('API GET error:', error)
    return NextResponse.json({ error: 'Failed to generate activities' }, { status: 500 })
  }
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
