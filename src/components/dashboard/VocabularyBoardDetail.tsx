import { useQuery } from '@tanstack/react-query';
import type { Board, Vocabulary } from '@/lib/db/schema';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import VocabularyDetailModal from './VocabularyDetailModal';
import AddVocabularyForm from '../admin/AddVocabularyForm';
import { useAdmin } from '../../contexts/AdminContext';

interface VocabularyBoardDetailProps {
  boardId: string;
}

// Map part of speech to abbreviations
function abbreviatePartOfSpeech(pos: string): string {
  const mapping: Record<string, string> = {
    'adjective': 'adj',
    'verb': 'v',
    'noun': 'n',
    'adverb': 'adv',
    'pronoun': 'pron',
    'preposition': 'prep',
    'conjunction': 'conj',
    'interjection': 'interj',
    'determiner': 'det',
    'article': 'art',
  };
  
  const lower = pos.toLowerCase();
  return mapping[lower] || pos;
}

async function fetchBoardWithItems(boardId: string) {
  const [boardRes, vocabRes] = await Promise.all([
    fetch(`/api/boards/${boardId}`),
    fetch('/api/vocabulary'),
  ]);

  if (!boardRes.ok) throw new Error('Failed to fetch board');
  if (!vocabRes.ok) throw new Error('Failed to fetch vocabulary');

  const board: Board = await boardRes.json();
  const allVocabulary: Vocabulary[] = await vocabRes.json();

  const itemIds = board.itemIds as string[];
  const vocabulary = allVocabulary.filter(v => itemIds.includes(v.id));

  return { board, vocabulary };
}

export default function VocabularyBoardDetail({ boardId }: VocabularyBoardDetailProps) {
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { isAdmin } = useAdmin();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['board-detail', boardId],
    queryFn: () => fetchBoardWithItems(boardId),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { board, vocabulary } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-base text-gray-600 mb-3">
            <a href="/dashboard/vocabulary" className="hover:text-black">Vocabulary</a>
            <span>/</span>
            <span className="truncate font-medium">{board.name}</span>
          </div>
          <h1 className="text-2xl font-bold mb-3">{board.name}</h1>
          <p className="text-lg text-gray-600">{board.description || 'Không có mô tả'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold transition-all duration-150 whitespace-nowrap active:translate-y-[4px]"
            style={{ 
              backgroundColor: '#FF6B6B', 
              fontSize: '1rem',
              boxShadow: '0 4px 0 0 #CC3333'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FA5252'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333'}
          >
            <Plus className="w-5 h-5" />
            Thêm Vocabulary
          </button>
        </div>

        {/* Desktop Table / Mobile Cards */}
        <div className="hidden md:block border border-gray-200 bg-white overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase">Từ ngữ</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase">Loại từ</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase">Phiên âm</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase">Ý nghĩa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vocabulary.map((item) => {
                const types = item.types as any;
                const firstType = Array.isArray(types) ? types[0] : null;
                const firstMeaning = firstType?.meanings?.[0] || '';
                const partOfSpeech = firstType?.type ? abbreviatePartOfSpeech(firstType.type) : '-';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedVocab(item)}>
                    <td className="px-4 py-4">
                      <span className="hover:underline font-bold text-lg">
                        {item.word}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-base text-gray-600">
                      {partOfSpeech}
                    </td>
                    <td className="px-4 py-4 text-base text-gray-600">
                      {item.phonetic}
                    </td>
                    <td className="px-4 py-4 text-base">
                      {firstMeaning}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {vocabulary.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3">
          {vocabulary.map((item) => {
            const types = item.types as any;
            const firstType = Array.isArray(types) ? types[0] : null;
            const firstMeaning = firstType?.meanings?.[0] || '';
            
            return (
              <div
                key={item.id}
                onClick={() => setSelectedVocab(item)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 active:bg-gray-50 cursor-pointer"
              >
                {/* Word + Audio */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{item.word}</h3>
                    <p className="text-base text-gray-500">{item.phonetic}</p>
                  </div>
                  {item.audioUrl && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Meaning */}
                <div className="mb-3">
                  <p className="text-lg leading-relaxed">{firstMeaning}</p>
                </div>

                {/* Grammar Note */}
                {item.grammar && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {item.grammar}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {vocabulary.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-lg font-medium text-gray-600">
          {vocabulary.length} từ vựng
        </div>

        {/* Vocabulary Detail Modal */}
        {selectedVocab && (
          <VocabularyDetailModal
            vocabulary={selectedVocab}
            isOpen={!!selectedVocab}
            onClose={() => setSelectedVocab(null)}
            isAdmin={isAdmin}
          />
        )}

        {/* Add Vocabulary Form */}
        {showAddForm && (
          <AddVocabularyForm
            onSuccess={() => {
              setShowAddForm(false);
              refetch();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}
