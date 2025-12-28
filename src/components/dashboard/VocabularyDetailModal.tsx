import { X, ExternalLink, Edit, Volume2 } from 'lucide-react';
import type { Vocabulary } from '@/lib/db/schema';

interface VocabularyDetailModalProps {
  vocabulary: Vocabulary;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  isAdmin?: boolean;
}

export default function VocabularyDetailModal({
  vocabulary,
  isOpen,
  onClose,
  onEdit,
  isAdmin = false,
}: VocabularyDetailModalProps) {
  if (!isOpen) return null;

  const types = vocabulary.types as any[];
  const examples = vocabulary.examples as string[];
  const synonyms = vocabulary.synonyms as string[];
  const wordForms = vocabulary.wordForms as string[];
  const topics = vocabulary.topics as string[];

  const cambridgeUrl = `https://dictionary.cambridge.org/dictionary/english/${vocabulary.word.toLowerCase()}`;
  const oxfordUrl = `https://www.oxfordlearnersdictionaries.com/definition/english/${vocabulary.word.toLowerCase()}`;
  const collinsUrl = `https://www.collinsdictionary.com/dictionary/english/${vocabulary.word.toLowerCase()}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-black">{vocabulary.word}</h2>
              {vocabulary.audioUrl && (
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-lg text-gray-600">{vocabulary.phonetic}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Grammar */}
          {vocabulary.grammar && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Grammar</h3>
              <p className="text-gray-900">{vocabulary.grammar}</p>
            </div>
          )}

          {/* Types & Meanings */}
          {types && types.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Definitions</h3>
              <div className="space-y-4">
                {types.map((type, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-gray-700 mb-1">{type.type}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {type.meanings?.map((meaning: string, mIdx: number) => (
                        <li key={mIdx} className="text-gray-900">{meaning}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Examples</h3>
              <ul className="space-y-2">
                {examples.map((example, idx) => (
                  <li key={idx} className="text-gray-900 italic">"{example}"</li>
                ))}
              </ul>
            </div>
          )}

          {/* Synonyms */}
          {synonyms && synonyms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((synonym, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Word Forms */}
          {wordForms && wordForms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Word Forms</h3>
              <div className="flex flex-wrap gap-2">
                {wordForms.map((form, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm">
                    {form}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {topics && topics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-50 text-green-900 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Band Score */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">IELTS Band</h3>
            <span className="px-3 py-1 bg-red-50 text-red-900 rounded-full text-sm font-semibold">
              Band {vocabulary.band}
            </span>
          </div>

          {/* Dictionary Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">External Dictionaries</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={cambridgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                Cambridge
              </a>
              <a
                href={oxfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                Oxford
              </a>
              <a
                href={collinsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                Collins
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
