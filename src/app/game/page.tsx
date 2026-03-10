"use client";

import { GameComponent } from "~/app/_components/game-component";
import cppFunctions from "~/data/cpp-functions.json";

export default function CppGamePage() {
  return <GameComponent language="cpp" functions={cppFunctions} />;
}
