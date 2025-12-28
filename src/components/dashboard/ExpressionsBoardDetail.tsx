import { useQuery } from '@tanstack/react-query';
import { useExpressionsByIds } from '../../hooks/useData';
import type { Board, Expression } from '@/lib/db/schema';
import { Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpressionDetailModal from './ExpressionDetailModal.tsx';
import AddExpressionForm from '../admin/AddExpressionForm';
import { useAdmin } from '../../contexts/AdminContext';

interface ExpressionsBoardDetailProps {
  boardId: string;
}

async function fetchBoard(boardId: string): Promise<Board> {
  const response = await fetch(`/api/boards/${boardId}`);
  if (!response.ok) throw new Error('Failed to fetch board');
  return response.json();
}

export default function ExpressionsBoardDetail({ boardId }: ExpressionsBoardDetailProps) {
  const [selectedExpression, setSelectedExpression] = useState<Expression | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { isAdmin } = useAdmin();
  
  const { data: board, isLoading: boardLoading, refetch: refetchBoard } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
  });

  const itemIds = (board?.itemIds as string[]) || [];
  const { data: expressionItems, isLoading: itemsLoading } = useExpressionsByIds(itemIds);

  const isLoading = boardLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'idiom':
        return 'bg-purple-100 text-purple-800';
      case 'phrase':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link 
            to="/dashboard/expressions" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Expressions Boards
          </Link>
          <h1 className="text-2xl font-bold mb-2">{board.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">{board.description || 'Không có mô tả'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          {isAdmin && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: '#FF6B6B', fontSize: '1rem' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FA5252'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
            >
              <Plus className="w-5 h-5" />
              Thêm Expression
            </button>
          )}
        </div>

        {/* Expression Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {expressionItems?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedExpression(item)}
              className="border border-gray-200 bg-white p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-black text-lg flex-1">{item.expression}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>
              
              {item.category && (
                <div className="mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.category}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-900 mb-3 font-medium">
                {item.meaning}
              </p>

              {item.examples && Array.isArray(item.examples) && item.examples.length > 0 ? (
                <p className="text-sm text-gray-600 italic line-clamp-2 mb-3">
                  "{(item.examples as string[])[0]}"
                </p>
              ) : null}

              {item.topics && Array.isArray(item.topics) && item.topics.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {(item.topics as string[]).slice(0, 3).map((topic: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                  {(item.topics as string[]).length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{(item.topics as string[]).length - 3}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {expressionItems?.length === 0 && (
          <div className="text-center py-12 border border-gray-200 bg-white">
            <p className="text-gray-500">Chưa có expressions nào trong bộ này</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {expressionItems?.length || 0} expressions
        </div>

        {/* Expression Detail Modal */}
        {selectedExpression && (
          <ExpressionDetailModal
            item={selectedExpression}
            isOpen={!!selectedExpression}
            onClose={() => setSelectedExpression(null)}
          />
        )}

        {/* Add Expression Form */}
        {showAddForm && (
          <AddExpressionForm
            onSuccess={() => {
              setShowAddForm(false);
              refetchBoard();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}
