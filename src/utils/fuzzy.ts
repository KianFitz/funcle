export function fuzzyMatch(query: string, text: string): boolean {
  let queryIdx = 0;
  for (let i = 0; i < text.length && queryIdx < query.length; i++) {
    if (text[i]?.toLowerCase() === query[queryIdx]?.toLowerCase()) {
      queryIdx++;
    }
  }
  return queryIdx === query.length;
}

export function fuzzyScore(query: string, text: string): number {
  let queryIdx = 0;
  let score = 0;
  let consecutiveMatches = 0;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  for (let i = 0; i < lowerText.length && queryIdx < lowerQuery.length; i++) {
    if (lowerText[i]?.toLowerCase() === lowerQuery[queryIdx]?.toLowerCase()) {
      queryIdx++;
      consecutiveMatches++;
      // Bonus for consecutive matches
      score += 10 + consecutiveMatches;
    } else {
      consecutiveMatches = 0;
    }
  }

  // Bonus for starting with query
  if (lowerText.startsWith(lowerQuery)) {
    score += 100;
  }

  return score;
}
