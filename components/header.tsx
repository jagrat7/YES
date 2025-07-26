"use client"
import Image from "next/image"
import { useEffect } from "react"

export function Header() {
  useEffect(() => {
    // Load Tenor embed script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://tenor.com/embed.js'
    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://tenor.com/embed.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-8 mb-8">
      <h1 className="text-6xl font-bold text-center mb-6 transform -rotate-1">YES!</h1>
      <div className="bg-gray-100 rounded-2xl border-2 border-black p-8 mb-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="tenor-gif-embed" data-postid="11047570" data-share-method="host" data-aspect-ratio="1.2" data-width="100%"></div>        
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 max-w-md mx-auto">
            <p className="text-gray-500 italic">
              "The point is to say YES to everything that scares you, everything that makes you uneasy, everything that
              makes you anxious."
            </p>
            <p className="text-sm text-gray-400 mt-2">- Yes Man (2008)</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border-2 border-black p-4 text-center">
        <p className="font-medium">Say YES to life! Complete silly activities and earn money for your adventures!</p>
      </div>
    </div>
  )
}
