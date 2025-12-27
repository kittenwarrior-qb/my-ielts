import { useState } from 'react';
import VocabularyCard from './VocabularyCard';
import AlphabetFilter from './AlphabetFilter';
import SearchBox from './SearchBox';
import Pagination from '../Pagination';
import { Select } from '../ui';

interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  audioUrl?: string;
  types: any[];
  examples: any[];
  topics: string[];
  level: string;
  band: number;
}

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface VocabularyListProps {
  initialData: VocabularyItem[];
  initialPage: number;
  totalPages: number;
  total: number;
  topics: Topic[];
  initialFilters?: {
    letter?: string;
    topic?: string;
    level?: string;
    search?: string;
  };
}

export default function VocabularyList({
  initialData,
  initialPage,
  totalPages,
  total,
  topics,
  initialFilters = {},
}: VocabularyListProps) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value };
    
    // Build URL with filters
    const params = new URLSearchParams();
    if (newFilters.letter) params.set('letter', newFilters.letter);
    if (newFilters.topic) params.set('topic', newFilters.topic);
    if (newFilters.level) params.set('level', newFilters.level);
    if (newFilters.search) params.set('search', newFilters.search);
    
    // Navigate to new URL
    window.location.href = `/vocabulary?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    window.location.href = `/vocabulary?${params.toString()}`;
  };

  const clearFilters = () => {
    window.location.href = '/vocabulary';
  };

  const hasActiveFilters = filters.letter || filters.topic || filters.level || filters.search;

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchBox
        initialValue={filters.search}
        onSearch={(value) => handleFilterChange('search', value)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Alphabet Filter */}
        <div className="flex-1 min-w-full">
          <AlphabetFilter
            selected={filters.letter}
            onSelect={(letter) => handleFilterChange('letter', letter)}
          />
        </div>

        {/* Topic Filter */}
        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <Select
            value={filters.topic || ''}
            onChange={(e) => handleFilterChange('topic', e.target.value || undefined)}
            options={[
              { value: '', label: 'All Topics' },
              ...topics.map(t => ({ value: t.slug, label: t.name })),
            ]}
          />
        </div>

        {/* Level Filter */}
        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <Select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value || undefined)}
            options={[
              { value: '', label: 'All Levels' },
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {initialData.length} of {total} words
        {hasActiveFilters && ' (filtered)'}
      </div>

      {/* Vocabulary Grid */}
      {initialData.length > 0 ? (
        <div className="space-y-4">
          {initialData.map((vocab, index) => (
            <VocabularyCard
              key={vocab.id}
              vocabulary={vocab}
              index={(initialPage - 1) * 20 + index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No vocabulary found matching your filters.
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={initialPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
