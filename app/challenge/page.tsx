import { ActivityCompletion } from "@/components/activity-completion"
import { Navigation } from "@/components/navigation"

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        <Navigation />

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 transform -rotate-1">Your YES Challenge! 🎯</h1>
          <p className="text-lg text-gray-700">Complete your activity and earn money for saying YES to life!</p>
        </div>

        <ActivityCompletion />

        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>Remember: The point of YES is to say YES to life! 🎬</p>
          <p className="mt-2">*Inspired by the movie "Yes Man" - Always say YES responsibly!</p>
        </footer>
      </div>
    </div>
  )
}
