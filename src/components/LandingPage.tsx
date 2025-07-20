'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 overflow-hidden bg-cover bg-center text-white">
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          FoundItZone
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-4 max-w-2xl mx-auto font-medium">
          A place where lost things get found again.
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-xl text-white/80">
          Be a part of the community helping others recover their lost items. Post what you found or search what you lost!
        </p>
        <Link
          href="/sign-up"
          className="bg-white text-indigo-700 font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-xl hover:bg-indigo-100 transition duration-300 ease-in-out"
        >
          Get Started – Sign Up
        </Link>
      </div>
      
      <footer className="absolute bottom-4 w-full text-center text-xs sm:text-sm text-white/60 z-10 px-4">
        &copy; 2025 FoundItZone. All Rights Reserved.
      </footer>
    </div>
  )
}
