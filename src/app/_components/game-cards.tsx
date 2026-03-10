"use client";

import type { CppFunction, FieldName, RevealState } from "~/types/game";

interface FieldCardProps {
  label: string;
  value: string | number;
  state: RevealState;
  hint?: string;
}

const stateColors: Record<RevealState, string> = {
  hidden: "bg-gray-700 text-gray-300",
  correct: "bg-green-600 text-white",
  incorrect: "bg-red-600 text-white",
  revealed: "bg-yellow-600 text-white",
};

const stateLabels: Record<RevealState, string> = {
  hidden: "?",
  correct: "✓",
  incorrect: "✗",
  revealed: "",
};

export function FieldCard({ label, value, state, hint }: FieldCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div
        className={`flex min-h-16 flex-col items-center justify-center rounded-lg p-3 transition-all ${stateColors[state]}`}
      >
        <div className="text-center">
          {state === "hidden" ? (
            <div className="text-2xl font-bold">{stateLabels[state]}</div>
          ) : (
            <>
              <div className="text-lg font-bold">{value}</div>
              {hint && (
                <div className="mt-1 text-xs opacity-80">{hint}</div>
              )}
            </>
          )}
        </div>
        {!hint && state !== "hidden" && (
          <div className="mt-1 text-xs font-bold opacity-70">
            {stateLabels[state]}
          </div>
        )}
      </div>
    </div>
  );
}

interface FunctionCardProps {
  func: CppFunction;
  isAnswer: boolean;
}

export function FunctionCard({ func }: FunctionCardProps) {
  return (
    <div className="rounded-xl border-2 border-gray-700 bg-gray-800 p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-100">{func.name}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Header
          </div>
          <div className="mt-2 rounded-lg bg-blue-900 p-3 font-mono text-sm text-blue-200">
            {func.header}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Introduced In
          </div>
          <div className="mt-2 rounded-lg bg-purple-900 p-3 font-semibold text-purple-200">
            {func.introducedIn}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Naming Style
          </div>
          <div className="mt-2 rounded-lg bg-green-900 p-3 font-mono text-sm text-green-200">
            {func.namingStyle}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Overloads
          </div>
          <div className="mt-2 rounded-lg bg-orange-900 p-3 text-center text-lg font-bold text-orange-200">
            {func.overloads}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Parameters
          </div>
          <div className="mt-2 rounded-lg bg-pink-900 p-3 text-center text-lg font-bold text-pink-200">
            {func.parameterCount}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GuessCardProps {
  guessedFunctionName: string;
  isCorrect: boolean;
  functionData?: CppFunction;
  fieldStates?: Record<FieldName, RevealState>;
  comparison?: {
    introducedIn: "earlier" | "later" | "correct";
    overloads: "fewer" | "more" | "correct";
    parameterCount: "fewer" | "more" | "correct";
  };
}

export function GuessCard({
  guessedFunctionName,
  isCorrect,
  functionData,
  fieldStates = {
    name: "hidden",
    header: "hidden",
    introducedIn: "hidden",
    namingStyle: "hidden",
    overloads: "hidden",
    parameterCount: "hidden",
  },
  comparison,
}: GuessCardProps) {
    if (!functionData) {
    return (
        <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
        <div className="text-center">
            <div className="font-semibold text-gray-700">
            {`"${guessedFunctionName}" not found`}
            </div>
        </div>
        </div>
    );
}

  const getHint = (
    field: "introducedIn" | "overloads" | "parameterCount"
  ): string | undefined => {
    if (!comparison) return undefined;
    const comp = comparison[field];

    if (comp === "correct") return undefined;

    if (field === "introducedIn") {
      return comp === "earlier" ? "↓ Earlier" : "↑ Later";
    }

    return comp === "fewer" ? "↓ Fewer" : "↑ More";
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 ${isCorrect ? "border-green-600 bg-green-900" : "border-red-600 bg-red-900"}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-100">{functionData.name}</h3>
        <span className={`text-xl font-bold ${isCorrect ? "text-green-300" : "text-red-300"}`}>
          {isCorrect ? "✓ Correct!" : "✗ Wrong"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <FieldCard
          label="Name"
          value={functionData.name}
          state={fieldStates.name}
        />
        <FieldCard
          label="Header"
          value={functionData.header}
          state={fieldStates.header}
        />
        <FieldCard
          label="Introduced In"
          value={functionData.introducedIn}
          state={fieldStates.introducedIn}
          hint={getHint("introducedIn")}
        />
        <FieldCard
          label="Naming Style"
          value={functionData.namingStyle}
          state={fieldStates.namingStyle}
        />
        <FieldCard
          label="Overloads"
          value={functionData.overloads}
          state={fieldStates.overloads}
          hint={getHint("overloads")}
        />
        <FieldCard
          label="Parameters"
          value={functionData.parameterCount}
          state={fieldStates.parameterCount}
          hint={getHint("parameterCount")}
        />
      </div>
    </div>
  );
}
