import type { Vocabulary, VocabularyFilters, PaginationInfo } from '../types';

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Paginate array
export function paginate<T>(
  items: T[],
  page: number,
  itemsPerPage: number = 20
): { items: T[]; pagination: PaginationInfo } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    },
  };
}

// Filter vocabulary
export function filterVocabulary(
  vocabulary: Vocabulary[],
  filters: VocabularyFilters
): Vocabulary[] {
  let filtered = [...vocabulary];

  if (filters.letter) {
    filtered = filtered.filter((v) =>
      v.word.toLowerCase().startsWith(filters.letter!.toLowerCase())
    );
  }

  if (filters.topic) {
    filtered = filtered.filter((v) =>
      v.topics.some((t) => t.toLowerCase() === filters.topic!.toLowerCase())
    );
  }

  if (filters.level) {
    filtered = filtered.filter((v) => v.level === filters.level);
  }

  if (filters.band) {
    filtered = filtered.filter((v) => v.band >= filters.band!);
  }

  return filtered;
}

// Get alphabet array
export function getAlphabet(): string[] {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Class names helper with tailwind-merge
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
