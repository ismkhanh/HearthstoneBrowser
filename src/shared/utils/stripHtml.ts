const TAG_PATTERN = /<[^>]*>/g;
const WHITESPACE_PATTERN = /\s+/g;

/** Card texts contain inline markup such as `<b>Lifesteal</b>`. */
export function stripHtml(value: string): string {
  return value.replace(TAG_PATTERN, '').replace(WHITESPACE_PATTERN, ' ').trim();
}
