import type { CppFunction } from "~/types/game";
import functions from "~/data/cpp-functions.json";
import { ratelimit } from "~/utils/ratelimit";

// Deterministic daily function selection based on date
function hashStringToIndex(s: string, mod: number) {
  // djb2 hash, deterministic and simple
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
  }
  // Convert to unsigned 32-bit and mod
  return (hash >>> 0) % mod;
}

function getDailyFunction(): CppFunction {
  const today = new Date();
  const dateKey = today.toISOString().split("T")[0] ?? ""; // YYYY-MM-DD

  const index = hashStringToIndex(dateKey, functions.length);
  return functions[index] as CppFunction;
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const dailyFunction = getDailyFunction();
    return Response.json({
      success: true,
      function: dailyFunction,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to get daily function",
      },
      { status: 500 }
    );
  }
}
