import Link from "next/link";
import {HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center px-4 py-20 sm:py-32">
          <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
            Funcle
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 text-center max-w-2xl">
            A daily puzzle game where you guess programming functions. Test your knowledge of C++, C#, and more.
          </p>
        </div>

        {/* Game Cards Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* C++ Card */}
            <Link
              href="/game"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚙️</span>
                  <h2 className="text-2xl font-bold text-white">C++ Functions</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Guess the daily C++ standard library function. Match headers, versions, and more to solve the puzzle.
                </p>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  Play Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* C# Card */}
            <Link
              href="/game/csharp"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-8 transition-all hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔷</span>
                  <h2 className="text-2xl font-bold text-white">C# Functions</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Guess the daily C# function. Test your knowledge of namespaces, versions, and language features.
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  Play Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Archive Card */}
            <Link
              href="/game/archive"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-8 transition-all hover:shadow-2xl hover:shadow-amber-500/20 md:col-span-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📚</span>
                  <h2 className="text-2xl font-bold text-white">Puzzle Archive</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Explore puzzles from the past. Play old puzzles for fun without affecting your daily streak.
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  Browse Archive
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-900/50 border-t border-gray-700">
          <div className="container mx-auto px-4 py-16">
            <h3 className="text-2xl font-bold text-center text-white mb-12">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Make a Guess</h4>
                <p className="text-gray-400 text-sm">
                  Enter a function name to make your guess. Get typeahead suggestions as you type.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💡</div>
                <h4 className="font-semibold text-white mb-2">Get Hints</h4>
                <p className="text-gray-400 text-sm">
                  Wrong guesses reveal information: correct fields show green, hints show which direction to go.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="font-semibold text-white mb-2">Build Streaks</h4>
                <p className="text-gray-400 text-sm">
                  Solve the daily puzzle to build your streak. Come back tomorrow for a new challenge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              One puzzle every day. Test your programming knowledge and learn something new.
            </p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
