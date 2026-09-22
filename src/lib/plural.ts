/**
 * Picks the right noun form for a count, so copy never reads
 * "Serving 1 countries" or "25 member".
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

/**
 * Convenience wrapper for the common "N noun" phrase used across the site.
 */
export function countLabel(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}
