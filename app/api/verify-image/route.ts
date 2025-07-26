import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Configure OpenAI to use OpenRouter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Set to true to force verification to always pass (for testing)
const FORCE_VERIFICATION_PASS = false

export async function POST(request: NextRequest) {
  try {
    const { image, activityTitle, activityDescription, proof, challenge, userTier, crazyLevel } = await request.json()

    // If forcing verification to pass, return success immediately
    if (FORCE_VERIFICATION_PASS) {
      console.log('🟢 FORCE_VERIFICATION_PASS is enabled - auto-approving')
      return NextResponse.json({ 
        verified: true, 
        reason: "Auto-approved for testing",
        confidence: 100
      })
    }

    // If no image provided, check text proof
    if (!image) {
      if (!proof || proof.trim().length < 10) {
        return NextResponse.json({ 
          verified: false, 
          reason: "Proof too short - please provide more details about completing the challenge",
          confidence: 0
        })
      }
      
      // For text-only proofs, use a simpler verification
      return NextResponse.json({ 
        verified: true, 
        reason: "Text proof provided",
        confidence: 75
      })
    }

    console.log('🔍 Verifying challenge completion:', challenge?.title || activityTitle)
    console.log('📊 Challenge details:', {
      tier: userTier,
      crazyLevel: crazyLevel,
      difficulty: challenge?.difficulty,
      reward: challenge?.reward
    })

    // Use AI to verify the image shows completion of the challenge
    const { text } = await generateText({
      model: openrouter("openai/gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a challenge verification expert for the "YES!" life-changing app. Analyze this image to determine if the person completed this challenge:

**CHALLENGE DETAILS:**
- Title: ${challenge?.title || activityTitle}
- Description: ${challenge?.description || activityDescription}
- Difficulty: ${challenge?.difficulty || 'unknown'}
- Crazy Level: ${challenge?.crazyLevel || crazyLevel || 'unknown'}/10
- User Tier: ${userTier || 'unknown'}
- Reward: $${challenge?.reward || 0}

**USER'S STORY:**
${proof || 'No text provided'}

**VERIFICATION INSTRUCTIONS:**
1. Look for evidence that matches the specific challenge requirements
2. Consider the difficulty level - higher crazy levels need more convincing proof
3. Be encouraging for genuine attempts, especially for difficult challenges
4. For social challenges, look for interaction with people
5. For creative challenges, look for originality and effort
6. For adventure challenges, look for new experiences or environments

**RESPOND WITH JSON:**
{
  "verified": true/false,
  "reason": "detailed explanation of your decision",
  "confidence": 0-100 (number indicating confidence level)
}

**EXAMPLES:**
- If challenge is "Try new cuisine" and image shows exotic food → VERIFY
- If challenge is "Give speech" and image shows person at podium → VERIFY
- If challenge is "Ask someone out" and image shows romantic dinner → VERIFY
- If image doesn't match challenge or seems fake → DON'T VERIFY

Be fair but thorough. The user is trying to change their life!`
            },
            {
              type: "image",
              image: image
            }
          ]
        }
      ]
    })

    console.log('🤖 AI verification response:', text)

    // Parse the AI response - try to extract JSON from the text
    let result;
    try {
      // First try direct JSON parse
      result = JSON.parse(text)
    } catch (parseError) {
      console.log('🔄 Direct JSON parse failed, trying to extract JSON from text...')
      
      // Try to extract JSON from markdown code blocks or mixed text
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                       text.match(/```\s*([\s\S]*?)\s*```/) ||
                       text.match(/{[\s\S]*}/)
      
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[1] || jsonMatch[0])
          console.log('✅ Successfully extracted JSON from text')
        } catch (extractError) {
          console.error('Failed to extract JSON from text:', extractError)
          console.error('Extracted text:', jsonMatch[1] || jsonMatch[0])
          
          // Try to parse the response manually based on keywords
          const verified = text.toLowerCase().includes('verified": true') || 
                          text.toLowerCase().includes('"verified":true') ||
                          !text.toLowerCase().includes('verified": false')
          
          result = {
            verified: false, // Default to false for safety
            reason: "AI response could not be parsed properly. Please try again.",
            confidence: 0
          }
        }
      } else {
        console.error('No JSON found in AI response')
        result = {
          verified: false,
          reason: "AI response format was invalid. Please try again.",
          confidence: 0
        }
      }
    }

    // Validate the result has required fields
    if (!result || typeof result.verified !== 'boolean') {
      console.error('Invalid result format:', result)
      result = {
        verified: false,
        reason: "Verification result was invalid. Please try again.",
        confidence: 0
      }
    }

    console.log('✅ Final verification result:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Image verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify image' }, 
      { status: 500 }
    )
  }
}