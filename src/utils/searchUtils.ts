/**
 * Highlights search terms in text by wrapping them in <mark> tags
 */
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

/**
 * Truncates text to a specified length and adds ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Extracts relevant snippet from text that contains the search term
 */
export const getSearchSnippet = (text: string, searchTerm: string, snippetLength: number = 150): string => {
  if (!searchTerm.trim()) {
    return truncateText(text, snippetLength);
  }

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerSearchTerm);

  if (index === -1) {
    return truncateText(text, snippetLength);
  }

  const start = Math.max(0, index - snippetLength / 2);
  const end = Math.min(text.length, index + searchTerm.length + snippetLength / 2);

  let snippet = text.substring(start, end);
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < text.length) {
    snippet = snippet + '...';
  }

  return snippet;
};
