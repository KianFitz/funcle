import type { CppFunction } from "~/types/game";
import functions from "~/data/cpp-functions.json";
import { ratelimit } from "~/utils/ratelimit";

export async function POST(request: Request) {
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

    const { guessFunctionName } = (await request.json()) as {
      guessFunctionName: string;
    };

    // Find the guessed function
    const guessedFunction = (functions as CppFunction[]).find(
      (f) => f.name.toLowerCase() === guessFunctionName.toLowerCase()
    );

    if (!guessedFunction) {
      return Response.json(
        {
          success: false,
          error: "Function not found",
          validFunctions: (functions as CppFunction[]).map((f) => f.name),
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      function: guessedFunction,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to validate guess",
      },
      { status: 500 }
    );
  }
}
