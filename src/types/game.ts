export interface CppFunction {
  name: string;
  header: string;
  introducedIn: string;
  namingStyle: string;
  overloads: number;
  parameterCount: number;
}

export type FieldName =
  | "name"
  | "header"
  | "introducedIn"
  | "namingStyle"
  | "overloads"
  | "parameterCount";

export type RevealState = "hidden" | "correct" | "incorrect" | "revealed";

export interface GuessResult {
  guess: string;
  guessedFunction: CppFunction | null;
  fields: Record<FieldName, RevealState>;
  comparison: {
    introducedIn: "earlier" | "later" | "correct";
    overloads: "fewer" | "more" | "correct";
    parameterCount: "fewer" | "more" | "correct";
  };
}

export interface GameState {
  dailyFunction: CppFunction;
  guesses: GuessResult[];
  gameOver: boolean;
  won: boolean;
  revealedFields: Partial<Record<FieldName, boolean>>;
}
