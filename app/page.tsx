import { Header } from "@/components/header"
import { TierCards } from "@/components/tier-cards"
import { ActivityCompletion } from "@/components/activity-completion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        <TierCards />
        <ActivityCompletion />

        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>Remember: The point of YES is to say YES to life! 🎬</p>
          <p className="mt-2">*Inspired by the movie "Yes Man" - Always say YES responsibly!</p>
        </footer>
      </div>
    </div>
  )
}
