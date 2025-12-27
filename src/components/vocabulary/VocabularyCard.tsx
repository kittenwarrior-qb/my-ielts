import { Volume2, BookOpen } from 'lucide-react';
import { Badge } from '../ui';

interface VocabularyCardProps {
  vocabulary: {
    id: string;
    word: string;
    phonetic: string;
    audioUrl?: string;
    types: Array<{ type: string; meanings: string[] }>;
    examples: string[];
    topics: string[];
    level: string;
    band: number;
  };
  index: number;
}

export default function VocabularyCard({ vocabulary, index }: VocabularyCardProps) {
  const playAudio = () => {
    if (vocabulary.audioUrl) {
      const audio = new Audio(vocabulary.audioUrl);
      audio.play();
    }
  };

  const levelColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  } as const;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Index */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span className="text-primary-700 dark:text-primary-300 font-semibold">
            {index}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Word & Phonetic */}
          <div className="flex items-center gap-3 mb-2">
            <a
              href={`/vocabulary/${vocabulary.word}`}
              className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {vocabulary.word}
            </a>
            {vocabulary.phonetic && (
              <span className="text-gray-500 dark:text-gray-400">
                {vocabulary.phonetic}
              </span>
            )}
            {vocabulary.audioUrl && (
              <button
                onClick={playAudio}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Play pronunciation"
              >
                <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </button>
            )}
          </div>

          {/* Types & Meanings */}
          <div className="space-y-2 mb-3">
            {vocabulary.types.slice(0, 2).map((type, idx) => (
              <div key={idx}>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 italic">
                  {type.type}
                </span>
                <ul className="mt-1 space-y-1">
                  {type.meanings.slice(0, 2).map((meaning, mIdx) => (
                    <li key={mIdx} className="text-sm text-gray-700 dark:text-gray-300">
                      • {meaning}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Example */}
          {vocabulary.examples.length > 0 && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{vocabulary.examples[0]}"
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={levelColors[vocabulary.level as keyof typeof levelColors]}>
              {vocabulary.level}
            </Badge>
            <Badge variant="primary">
              Band {vocabulary.band}
            </Badge>
            {vocabulary.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="default">
                {topic}
              </Badge>
            ))}
            <a
              href={`/vocabulary/${vocabulary.word}`}
              className="ml-auto text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
