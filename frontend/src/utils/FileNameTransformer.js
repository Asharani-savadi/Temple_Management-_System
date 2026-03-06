/**
 * Transform a filename into a user-friendly display name
 * @param {string} filename - The original filename
 * @returns {string} - The transformed, user-friendly name
 */
export function transformFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  // Remove file extension (only if there's a dot)
  let name = filename.lastIndexOf('.') > 0 
    ? filename.substring(0, filename.lastIndexOf('.'))
    : filename;
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Replace hyphens with spaces
  name = name.replace(/-/g, ' ');
  
  // Remove leading word(s) followed by numbers and spaces (e.g., "bhajan 01 ", "stotra 001 ")
  // This handles patterns like "bhajan_01_" or "stotra-001-"
  name = name.replace(/^[a-z]+\s+\d+\s+/i, '');
  
  // Also remove just leading numbers and spaces (e.g., "01 ", "001 ")
  name = name.replace(/^\d+\s+/, '');
  
  // Convert to title case (capitalize first letter of each word, lowercase the rest)
  name = name.replace(/\b\w/g, (char) => char.toUpperCase());
  name = name.replace(/\B\w/g, (char) => char.toLowerCase());
  
  // Clean up multiple spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}
