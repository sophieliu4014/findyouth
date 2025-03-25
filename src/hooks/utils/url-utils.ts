
/**
 * Creates a URL-friendly slug from an organization name
 * Converts to lowercase and replaces spaces with hyphens
 * 
 * @param name The organization name to convert
 * @returns A URL-friendly slug
 */
export const createOrganizationSlug = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Converts a slug back to a readable organization name
 * Replaces hyphens with spaces and capitalizes each word
 * 
 * @param slug The URL slug to convert
 * @returns A readable organization name
 */
export const slugToOrganizationName = (slug: string): string => {
  if (!slug) return '';
  return slug
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};
