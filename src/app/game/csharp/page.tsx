"use client";

import { GameComponent } from "~/app/_components/game-component";
import csharpFunctions from "~/data/csharp-functions.json";

export default function CSharpGamePage() {
  return <GameComponent language="csharp" functions={csharpFunctions} />;
}
