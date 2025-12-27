import { useState } from 'react';
import { Volume2, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle, CardContent } from '../ui';

interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  audioUrl?: string;
  userAudioUrl?: string;
  types: Array<{ type: string; meanings: string[] }>;
  examples: string[];
  synonyms: string[];
  wordForms: string[];
  topics: string[];
  level: string;
  band: number;
}

interface VocabularyDetailProps {
  vocabulary: VocabularyItem;
  relatedVocabulary: VocabularyItem[];
}

export default function VocabularyDetail({ vocabulary, relatedVocabulary }: VocabularyDetailProps) {
  const [audioPlaying, setAudioPlaying] = useState<'main' | 'user' | null>(null);

  const playAudio = (url: string, type: 'main' | 'user') => {
    const audio = new Audio(url);
    setAudioPlaying(type);
    audio.play();
    audio.onended = () => setAudioPlaying(null);
  };

  const levelColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  } as const;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <a
        href="/vocabulary"
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vocabulary List
      </a>

      {/* Main Card */}
      <Card>
        {/* Word Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {vocabulary.word}
              </h1>
              {vocabulary.phonetic && (
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {vocabulary.phonetic}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {vocabulary.audioUrl && (
                <button
                  onClick={() => playAudio(vocabulary.audioUrl!, 'main')}
                  className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className={`w-6 h-6 text-primary-600 dark:text-primary-400 ${audioPlaying === 'main' ? 'animate-pulse' : ''}`} />
                </button>
              )}
              {vocabulary.userAudioUrl && (
                <button
                  onClick={() => playAudio(vocabulary.userAudioUrl!, 'user')}
                  className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  title="Play your recording"
                >
                  <Volume2 className={`w-6 h-6 text-green-600 dark:text-green-400 ${audioPlaying === 'user' ? 'animate-pulse' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={levelColors[vocabulary.level as keyof typeof levelColors]} size="md">
              {vocabulary.level}
            </Badge>
            <Badge variant="primary" size="md">
              IELTS Band {vocabulary.band}
            </Badge>
            {vocabulary.topics.map((topic) => (
              <Badge key={topic} variant="default" size="md">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Definitions by Type */}
        <div className="space-y-6 mb-6">
          {vocabulary.types.map((type, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-400 italic mb-3">
                {type.type}
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                {type.meanings.map((meaning, mIdx) => (
                  <li key={mIdx} className="text-gray-700 dark:text-gray-300">
                    {meaning}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Examples */}
        {vocabulary.examples.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Examples
            </h2>
            <div className="space-y-3">
              {vocabulary.examples.map((example, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{example}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synonyms */}
        {vocabulary.synonyms.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Synonyms
            </h2>
            <div className="flex flex-wrap gap-2">
              {vocabulary.synonyms.map((synonym, idx) => (
                <a
                  key={idx}
                  href={`/vocabulary/${synonym}`}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                >
                  {synonym}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Word Forms */}
        {vocabulary.wordForms.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Word Forms
            </h2>
            <div className="flex flex-wrap gap-2">
              {vocabulary.wordForms.map((form, idx) => (
                <a
                  key={idx}
                  href={`/vocabulary/${form}`}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium"
                >
                  {form}
                </a>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Related Vocabulary */}
      {relatedVocabulary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedVocabulary.map((vocab) => (
                <a
                  key={vocab.id}
                  href={`/vocabulary/${vocab.word}`}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {vocab.word}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vocab.phonetic}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  {vocab.types[0] && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {vocab.types[0].meanings[0]}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
