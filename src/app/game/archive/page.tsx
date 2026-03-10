"use client";

import { useState } from "react";
import { GameComponent } from "~/app/_components/game-component";
import type { CppFunction } from "~/types/game";
import cppFunctions from "~/data/cpp-functions.json";
import csharpFunctions from "~/data/csharp-functions.json";
import Link from "next/link";

const START_DATE = new Date("2026-03-10"); // Today's date (March 10, 2026)

export default function ArchivePage() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const [selectedDate, setSelectedDate] = useState<string>(
    yesterday.toISOString().split("T")[0] ?? ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"cpp" | "csharp">("cpp");
  const [showGame, setShowGame] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    
    // Ensure date doesn't go before start date and before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= START_DATE && newDate < today) {
      setSelectedDate(e.target.value);
      setShowGame(false);
    }
  };

  const maxDate = yesterday.toISOString().split("T")[0];
  const minDate = START_DATE.toISOString().split("T")[0] ?? "";

  const functions = (selectedLanguage === "cpp" ? cppFunctions : csharpFunctions) as CppFunction[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {!showGame ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-4 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <h1 className="text-5xl font-bold text-indigo-400 mb-2">Puzzle Archive</h1>
              <p className="text-gray-400">
                {`Play any puzzle from the archive. Archive games don't affect your streak.`}
              </p>
            </div>

            {/* Language Selector */}
            <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Select Language
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedLanguage("cpp")}
                  className={`flex-1 rounded-lg px-4 py-3 font-semibold transition ${
                    selectedLanguage === "cpp"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  ⚙️ C++
                </button>
                <button
                  onClick={() => setSelectedLanguage("csharp")}
                  className={`flex-1 rounded-lg px-4 py-3 font-semibold transition ${
                    selectedLanguage === "csharp"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  🔷 C#
                </button>
              </div>
            </div>

            {/* Date Selector */}
            <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Select a date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
                className="w-full rounded-lg border-2 border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none font-mono"
              />
              <p className="text-xs text-gray-400 mt-2">
                Available from {new Date(minDate).toLocaleDateString()} to today
              </p>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setShowGame(true)}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              Play {new Date(selectedDate).toLocaleDateString()} - {selectedLanguage === "cpp" ? "C++" : "C#"}
            </button>

            {/* Info */}
            <div className="mt-8 rounded-lg bg-gray-800 p-4 text-center shadow">
              <p className="text-sm text-gray-400">
                {`💡 Playing archive puzzles won't affect your daily streak or game history.`}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowGame(false)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Archive
              </button>
            </div>
            <GameComponent
              language={selectedLanguage}
              functions={functions}
              archiveDate={selectedDate}
              isArchiveMode={true}
            />
          </>
        )}
      </div>
    </main>
  );
}
