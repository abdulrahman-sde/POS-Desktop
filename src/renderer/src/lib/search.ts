// Spaces, dashes, brackets and other symbols are dropped, and capitals are ignored: "Y50 PRO", "y50-pro" and "y50pro"
// all become "y50pro".
const squash = (text: string): string => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

// True when every word you typed is found in one of the values (name, item code, brand...). Word order does not matter:
// "y50pro", "y50 pro" and "pro y50" all find "Y50 PRO". This is for search boxes only. Matching an invoice item to a
// product stays strict (`features/purchases/import/match.ts`).
export function matchesSearch(query: string, values: string[]): boolean {
  const typed = query.trim().toLowerCase()
  if (!typed) return true
  const haystack = values.map(squash)
  const words = typed.split(/\s+/).map(squash).filter(Boolean)
  if (words.length === 0) return values.some((value) => value.toLowerCase().includes(typed))
  return words.every((word) => haystack.some((value) => value.includes(word)))
}
