import type { CppFunction } from "~/types/game";
import functions from "~/data/cpp-functions.json";
import { ratelimit } from "~/utils/ratelimit";

// Deterministic daily function selection based on date
function getDailyFunction(): CppFunction {
  const today = new Date();
  const startDate = new Date("2024-01-01");
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const index = daysSinceStart % functions.length;
  return functions[index] as CppFunction;
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
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
