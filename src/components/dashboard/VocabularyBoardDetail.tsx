import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../hooks/useData';
import type { Board, Vocabulary } from '@/lib/db/schema';
import { Plus, Zap, Target, CreditCard } from 'lucide-react';
import { useState } from 'react';
import VocabularyDetailModal from './VocabularyDetailModal';

interface VocabularyBoardDetailProps {
  boardId: string;
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
  
  const { data, isLoading } = useQuery({
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/dashboard/vocabulary" className="hover:text-black">Vocabulary</a>
            <span>/</span>
            <span className="text-black">{board.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">{board.name}</h1>
          <p className="text-gray-600">{board.description || 'Không có mô tả'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Thêm
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">
            <Zap className="w-4 h-4" />
            Speed Review
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">
            <Target className="w-4 h-4" />
            Trắc nghiệm
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">
            <CreditCard className="w-4 h-4" />
            Xem thẻ
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thuật ngữ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cách đọc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ý nghĩa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giải thích</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vocabulary.map((item) => {
                const types = item.types as any;
                const firstType = Array.isArray(types) ? types[0] : null;
                const firstMeaning = firstType?.meanings?.[0] || '';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedVocab(item)}>
                    <td className="px-4 py-3">
                      <span className="text-black hover:underline font-medium">
                        {item.word}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.phonetic}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {firstMeaning}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.grammar || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {vocabulary.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {vocabulary.length} từ vựng
        </div>

        {/* Vocabulary Detail Modal */}
        {selectedVocab && (
          <VocabularyDetailModal
            vocabulary={selectedVocab}
            isOpen={!!selectedVocab}
            onClose={() => setSelectedVocab(null)}
            isAdmin={false} // TODO: Check admin status
          />
        )}
      </div>
    </div>
  );
}
