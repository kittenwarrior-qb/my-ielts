import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../../lib/utils';

interface SearchBoxProps {
  initialValue?: string;
  onSearch: (value: string | undefined) => void;
}

export default function SearchBox({ initialValue = '', onSearch }: SearchBoxProps) {
  const [value, setValue] = useState(initialValue);

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(value || undefined);
    }, 500);

    if (value !== initialValue) {
      debouncedSearch();
    }
  }, [value]);

  const handleClear = () => {
    setValue('');
    onSearch(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search vocabulary by word, meaning, or example..."
          className="input pl-10 pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </form>
  );
}
