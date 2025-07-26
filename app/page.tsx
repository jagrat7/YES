import { Header } from "@/components/header"
import { TierCards } from "@/components/tier-cards"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        <Header />
        <TierCards />

        {/* Challenge CTA Section */}
        <div className="bg-white rounded-3xl border-4 border-black p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Challenge?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Get your personalized activity and start earning money by saying YES to life!
            </p>
            <Button
              asChild
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-xl border-2 border-black transform hover:scale-105 transition-transform text-lg"
            >
              <Link href="/challenge">🎯 Start Your YES Challenge!</Link>
            </Button>
          </div>
        </div>

        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>Remember: The point of YES is to say YES to life! 🎬</p>
          <p className="mt-2">*Inspired by the movie "Yes Man" - Always say YES responsibly!</p>
        </footer>
      </div>
    </div>
  )
}
