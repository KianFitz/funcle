"use client";

import { useState, useEffect } from "react";
import type { CppFunction, GameState, GuessResult, FieldName, RevealState } from "~/types/game";
import { GuessCard } from "~/app/_components/game-cards";
import { fuzzyMatch, fuzzyScore } from "~/utils/fuzzy";

interface GameHistory {
  date: string;
  won: boolean;
  guesses: GuessResult[];
  functionName: string;
}

interface StreakData {
  currentStreak: number;
  lastGameDate: string;
}

interface GameComponentProps {
  language: "cpp" | "csharp";
  functions: CppFunction[];
  archiveDate?: string; // Format: YYYY-MM-DD
  isArchiveMode?: boolean;
}

// Helper function to compare version strings
function compareVersions(v1: string, v2: string): number {
  // Map version strings to numeric values for comparison
  const versionMap: Record<string, number> = {
    // C++ versions
    "C++98": 1,
    "C++03": 2,
    "C++11": 3,
    "C++14": 4,
    "C++17": 5,
    "C++20": 6,
    "C++23": 7,
    // C# versions
    "C# 1.0": 1,
    "C# 1.2": 2,
    "C# 2.0": 3,
    "C# 3.0": 4,
    "C# 4.0": 5,
    "C# 5.0": 6,
    "C# 6.0": 7,
    "C# 7.0": 8,
    "C# 8.0": 9,
    "C# 9.0": 10,
    "C# 10.0": 11,
  };

  const val1 = versionMap[v1] ?? 0;
  const val2 = versionMap[v2] ?? 0;

  if (val1 < val2) return -1;
  if (val1 > val2) return 1;
  return 0;
}

export function GameComponent({ language, functions, archiveDate, isArchiveMode = false }: GameComponentProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [guessInput, setGuessInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [streak, setStreak] = useState(0);

  const storageKeys = {
    streak: `funcle${language}Streak`,
    currentGame: `funcle${language}CurrentGame`,
    history: `funcle${language}GameHistory`,
  };

  // Helper function to get daily function for any date
  function getFunctionForDate(date: string): CppFunction {
    const dateObj = new Date(date);
    const startDate = new Date("2024-01-01");
    const daysSinceStart = Math.floor(
      (dateObj.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const index = daysSinceStart % functions.length;
    return functions[index] as CppFunction;
  }

  // Fetch the daily function
  useEffect(() => {
    const fetchDailyFunction = async () => {
      try {
        // In archive mode, use the provided date; otherwise use today
        const gameDate = isArchiveMode ? archiveDate : new Date().toISOString().split("T")[0];
        
        if (!gameDate) {
          console.error("No date available");
          return;
        }

        if (!isArchiveMode) {
          // Load streak from localStorage (only for daily games)
          const streakData = localStorage.getItem(storageKeys.streak);
          const streakInfo = streakData ? (JSON.parse(streakData) as StreakData) : { currentStreak: 0, lastGameDate: "" };

          // Check if today is a new day
          const today = new Date().toISOString().split("T")[0];
          if (streakInfo.lastGameDate !== today) {
            // New day, check if we should reset the streak
            const gameHistory = localStorage.getItem(storageKeys.history);
            if (gameHistory) {
              const history: GameHistory[] = JSON.parse(gameHistory);
              const lastGame = history[history.length - 1];
              const lastGameDate = lastGame?.date;

              // If last game wasn't yesterday, reset streak
              const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
                .toISOString()
                .split("T")[0];
              if (lastGameDate !== yesterday) {
                streakInfo.currentStreak = 0;
              }
            }
          }

          setStreak(streakInfo.currentStreak);
        }

        // Get function for the selected date
        const dailyFunction = getFunctionForDate(gameDate);

        if (!dailyFunction) {
          console.error("Daily function not found");
          return;
        }

        // Check if there's a saved game state for this date (only for daily games)
        if (!isArchiveMode) {
          const savedGameState = localStorage.getItem(storageKeys.currentGame);
          if (savedGameState) {
            const saved = JSON.parse(savedGameState) as GameState & { date: string };
            if (saved.date === gameDate) {
              // Load the saved game state
              setGameState(saved);
              setLoading(false);
              return;
            }
          }
        }

        // New game
        setGameState({
          dailyFunction,
          guesses: [],
          gameOver: false,
          won: false,
          revealedFields: {},
        });
      } catch (error) {
        console.error("Failed to fetch daily function:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyFunction();
  }, [language, functions, isArchiveMode, archiveDate]);

  const handleGuessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuessInput(value);
    setSelectedSuggestion(-1);

    if (value.length >= 2) {
      const matches = functions
        .filter((f) => fuzzyMatch(value, f.name))
        .sort((a, b) => fuzzyScore(value, b.name) - fuzzyScore(value, a.name))
        .slice(0, 5)
        .map((f) => f.name);

      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setGuessInput(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestion]);
        }
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameState || !guessInput.trim()) return;

    try {
      const guessedFunc = functions.find(
        (f) => f.name.toLowerCase() === guessInput.toLowerCase()
      );

      if (!guessedFunc) {
        alert("Function not found");
        return;
      }

      const dailyFunc = gameState.dailyFunction;
      const isCorrect =
        guessedFunc.name.toLowerCase() === dailyFunc.name.toLowerCase();

      // Calculate field states
      const fields: Record<FieldName, RevealState> = {
        name:
          guessedFunc.name.toLowerCase() === dailyFunc.name.toLowerCase()
            ? "correct"
            : "incorrect",
        header: guessedFunc.header === dailyFunc.header ? "correct" : "incorrect",
        introducedIn:
          guessedFunc.introducedIn === dailyFunc.introducedIn
            ? "correct"
            : "incorrect",
        namingStyle:
          guessedFunc.namingStyle === dailyFunc.namingStyle
            ? "correct"
            : "incorrect",
        overloads:
          guessedFunc.overloads === dailyFunc.overloads
            ? "correct"
            : Math.abs(guessedFunc.overloads - dailyFunc.overloads) <= 2
              ? "revealed"
              : "incorrect",
        parameterCount:
          guessedFunc.parameterCount === dailyFunc.parameterCount
            ? "correct"
            : Math.abs(guessedFunc.parameterCount - dailyFunc.parameterCount) <= 2
              ? "revealed"
              : "incorrect",
      };

      // Calculate comparison for numeric fields
      const comparison = {
        introducedIn:
          guessedFunc.introducedIn === dailyFunc.introducedIn
            ? ("correct" as const)
            : compareVersions(guessedFunc.introducedIn, dailyFunc.introducedIn) < 0
              ? ("later" as const)
              : ("earlier" as const),
        overloads:
          guessedFunc.overloads === dailyFunc.overloads
            ? ("correct" as const)
            : guessedFunc.overloads < dailyFunc.overloads
              ? ("more" as const)
              : ("fewer" as const),
        parameterCount:
          guessedFunc.parameterCount === dailyFunc.parameterCount
            ? ("correct" as const)
            : guessedFunc.parameterCount < dailyFunc.parameterCount
              ? ("more" as const)
              : ("fewer" as const),
      };

      const guessResult: GuessResult = {
        guess: guessInput,
        guessedFunction: guessedFunc,
        fields,
        comparison,
      };

      const gameOver = isCorrect || gameState.guesses.length >= 5;
      const newGuesses = [...gameState.guesses, guessResult];

      // Get the date for saving (use archive date if in archive mode, otherwise today)
      const saveDate = (isArchiveMode && archiveDate) ? archiveDate : (new Date().toISOString().split("T")[0] as string);

      // Only save to persistent storage if NOT in archive mode
      if (!isArchiveMode) {
        setGameState((prev) =>
          prev
            ? (() => {
                const updatedGameState: GameState = {
                  ...prev,
                  guesses: newGuesses,
                  gameOver,
                  won: isCorrect,
                };
                localStorage.setItem(
                  storageKeys.currentGame,
                  JSON.stringify({ ...updatedGameState, date: saveDate })
                );
                return updatedGameState;
              })()
            : null
        );

        // Save to localStorage if game is over
        if (gameOver) {
          const gameHistory: GameHistory[] = JSON.parse(
            localStorage.getItem(storageKeys.history) ?? "[]"
          );

          gameHistory.push({
            date: saveDate,
            won: isCorrect,
            guesses: [...gameState.guesses, guessResult],
            functionName: dailyFunc.name,
          });

          localStorage.setItem(storageKeys.history, JSON.stringify(gameHistory));

          // Update streak
          let newStreak = streak;
          if (isCorrect) {
            newStreak = streak + 1;
          } else {
            newStreak = 0;
          }

          setStreak(newStreak);
          localStorage.setItem(
            storageKeys.streak,
            JSON.stringify({
              currentStreak: newStreak,
              lastGameDate: saveDate,
            })
          );
        }
      } else {
        // In archive mode, just update game state without saving to history
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                guesses: newGuesses,
                gameOver,
                won: isCorrect,
              }
            : null
        );
      }

      setGuessInput("");
    } catch (error) {
      console.error("Failed to process guess:", error);
      alert("Error processing guess");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold text-indigo-400">Funcle</div>
          <div className="text-gray-400">{`Loading today's puzzle...`}</div>
        </div>
      </main>
    );
  }

  if (!gameState) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center text-red-400">Failed to load game</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-indigo-400">Funcle</h1>
          <p className="mt-2 text-gray-400">
            Guess the {language === "cpp" ? "C++" : "C#"} function in 6 tries!
          </p>
        </div>

        {/* Game Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-800 p-4 text-center shadow">
            <div className="text-sm font-semibold text-gray-400">Guesses</div>
            <div className="mt-2 text-2xl font-bold text-indigo-400">
              {gameState.guesses.length}/6
            </div>
          </div>
          <div className="rounded-lg bg-gray-800 p-4 text-center shadow">
            <div className="text-sm font-semibold text-gray-400">Streak</div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-2xl">{streak > 0 ? "🔥" : "❄️"}</span>
              <span className="text-2xl font-bold text-orange-400">{streak}</span>
            </div>
          </div>
        </div>

        {/* Guess Input */}
        {!gameState.gameOver && (
          <form onSubmit={handleGuess} className="mb-8">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={guessInput}
                  onChange={handleGuessInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Enter ${language === "cpp" ? "C++" : "C#"} function name`}
                  className="w-full rounded-lg border-2 border-gray-600 bg-gray-800 px-4 py-3 font-mono text-white placeholder-gray-500 focus:border-indigo-400 focus:outline-none"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border-2 border-gray-600 bg-gray-800 shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`block w-full px-4 py-2 text-left font-mono transition ${
                          index === selectedSuggestion
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                        } ${index === 0 ? "rounded-t-md" : ""} ${
                          index === suggestions.length - 1 ? "rounded-b-md" : ""
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
              >
                Guess
              </button>
            </div>
          </form>
        )}

        {/* Game Over - Show Answer */}
        {gameState.gameOver && !gameState.won && (
          <div className="mb-8 rounded-lg bg-red-900 border-2 border-red-700 p-6 text-center shadow">
            <p className="text-sm font-semibold text-red-300 mb-2">Game Over!</p>
            <p className="text-gray-300 mb-3">The function was:</p>
            <div className="text-3xl font-bold text-red-300 font-mono">
              {gameState.dailyFunction.name}
            </div>
          </div>
        )}

        {/* Game Over - Won */}
        {gameState.gameOver && gameState.won && (
          <div className="mb-8 rounded-lg bg-green-900 border-2 border-green-700 p-6 text-center shadow">
            <p className="text-sm font-semibold text-green-300 mb-2">You won!</p>
            <p className="text-gray-300">Congratulations! Come back tomorrow for a new puzzle.</p>
          </div>
        )}

        {/* Previous Guesses */}
        {gameState.guesses.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-200">
              Previous Guesses
            </h2>
            <div className="space-y-3">
              {[...gameState.guesses].reverse().map((guess, index) => (
                <GuessCard
                  key={index}
                  guessedFunctionName={guess.guess}
                  isCorrect={
                    guess.guessedFunction?.name ===
                    gameState.dailyFunction.name
                  }
                  functionData={guess.guessedFunction ?? undefined}
                  fieldStates={guess.fields}
                  comparison={guess.comparison}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="rounded-lg bg-gray-800 p-4 text-center shadow">
          <p className="text-sm text-gray-400">
            💡 Tip: Each wrong guess reveals more information about the
            function!
          </p>
        </div>
      </div>
    </main>
  );
}
