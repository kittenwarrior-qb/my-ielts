import { useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { ParsedWordData } from '../../lib/dictionary';

interface WordFetcherProps {
  onWordFetched: (data: ParsedWordData) => void;
}

export default function WordFetcher({ onWordFetched }: WordFetcherProps) {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFetch = async () => {
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`/api/dictionary/${word.trim()}`);
      const result = await response.json();

      if (result.success) {
        onWordFetched(result.data);
        setSuccess(true);
        setError('');
      } else {
        setError(result.error || 'Word not found');
        setSuccess(false);
      }
    } catch (err) {
      setError('Failed to fetch word data');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fetch Word from Dictionary
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a word (e.g., abundant)"
              className="input pr-10"
              disabled={loading}
            />
            {success && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {error && (
              <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          <button
            onClick={handleFetch}
            disabled={loading || !word.trim()}
            className="btn btn-primary min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Fetch
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Word data fetched successfully! You can edit below before saving.
          </p>
        )}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>💡 Tip: Enter a word and click "Fetch" to automatically get:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Phonetic pronunciation</li>
          <li>Audio pronunciation (if available)</li>
          <li>Definitions by part of speech</li>
          <li>Example sentences</li>
          <li>Synonyms</li>
        </ul>
      </div>
    </div>
  );
}
