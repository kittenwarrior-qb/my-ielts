import { cn } from '../../lib/utils';

interface AlphabetFilterProps {
  selected?: string;
  onSelect: (letter: string | undefined) => void;
}

export default function AlphabetFilter({ selected, onSelect }: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filter by Letter
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(undefined)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            !selected
              ? 'bg-primary-600 text-white dark:bg-primary-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          )}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onSelect(letter)}
            className={cn(
              'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
              selected === letter
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
