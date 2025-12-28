import { useQuery } from '@tanstack/react-query';
import { useGrammarByIds } from '../../hooks/useData';
import type { Board, Grammar } from '@/lib/db/schema';
import { Plus, ArrowLeft, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GrammarDetailModal from './GrammarDetailModal.tsx';
import AddGrammarForm from '../admin/AddGrammarForm';
import EditGrammarForm from '../admin/EditGrammarForm';
import ErrorDialog from './ErrorDialog';
import DeleteGrammarDialog from './DeleteGrammarDialog';
import { useAdmin } from '../../contexts/AdminContext';

interface GrammarBoardDetailProps {
  boardId: string;
}

async function fetchBoard(boardId: string): Promise<Board> {
  const response = await fetch(`/api/boards/${boardId}`);
  if (!response.ok) throw new Error('Failed to fetch board');
  return response.json();
}

export default function GrammarBoardDetail({ boardId }: GrammarBoardDetailProps) {
  const { isAdmin } = useAdmin();
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editGrammar, setEditGrammar] = useState<Grammar | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Không có quyền');
  const [deleteGrammar, setDeleteGrammar] = useState<Grammar | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { data: board, isLoading: boardLoading, refetch: refetchBoard } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
  });

  const itemIds = (board?.itemIds as string[]) || [];
  const { data: grammarItems, isLoading: itemsLoading } = useGrammarByIds(itemIds);

  const isLoading = boardLoading || itemsLoading;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);

  const handleEdit = (grammar: Grammar) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorTitle('Không có quyền');
      setErrorMessage('Bạn không có quyền chỉnh sửa grammar.\n\nChỉ Admin mới có thể chỉnh sửa grammar.');
      setShowErrorDialog(true);
      return;
    }
    
    setEditGrammar(grammar);
  };

  const handleDelete = (grammar: Grammar) => {
    setMenuOpenId(null);
    setDeleteGrammar(grammar);
  };

  const confirmDelete = async () => {
    if (!deleteGrammar) return;

    try {
      const response = await fetch(`/api/grammar/${deleteGrammar.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401 || response.status === 403) {
          setErrorTitle('Không có quyền');
          setErrorMessage(result.error || 'Bạn không có quyền thực hiện thao tác này');
          setShowErrorDialog(true);
        } else {
          setErrorTitle('Lỗi');
          setErrorMessage(result.error || 'Không thể xóa grammar');
          setShowErrorDialog(true);
        }
        setDeleteGrammar(null);
        return;
      }

      setDeleteGrammar(null);
      refetchBoard();
    } catch (err) {
      setErrorTitle('Lỗi');
      setErrorMessage(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setShowErrorDialog(true);
      setDeleteGrammar(null);
    }
  };

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
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
            to="/dashboard/grammar" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Grammar Boards
          </Link>
          <h1 className="text-2xl font-bold mb-2">{board.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">{board.description || 'Không có mô tả'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold transition-all duration-150 whitespace-nowrap active:translate-y-[4px]"
            style={{ backgroundColor: '#FF6B6B', fontSize: '1rem', boxShadow: '0 4px 0 0 #CC3333' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FA5252'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333'}
          >
            <Plus className="w-5 h-5" />
            Thêm Grammar
          </button>
        </div>

        {/* Grammar Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {grammarItems?.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 bg-white p-6 hover:bg-gray-50 transition-colors relative group"
            >
              {/* Three dots menu */}
              <div className="absolute top-4 right-4" ref={menuOpenId === item.id ? menuRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === item.id ? null : item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {menuOpenId === item.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              <div onClick={() => setSelectedGrammar(item)} className="cursor-pointer pr-8">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-black text-lg">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <code className="text-sm text-gray-700 font-mono">
                    {item.structure.length > 80 ? item.structure.substring(0, 80) + '...' : item.structure}
                  </code>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.explanation}
                </p>

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
            </div>
          ))}
        </div>

        {grammarItems?.length === 0 && (
          <div className="text-center py-12 border border-gray-200 bg-white">
            <p className="text-gray-500">Chưa có grammar items nào trong bộ này</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {grammarItems?.length || 0} grammar items
        </div>

        {/* Grammar Detail Modal */}
        {selectedGrammar && (
          <GrammarDetailModal
            item={selectedGrammar}
            isOpen={!!selectedGrammar}
            onClose={() => setSelectedGrammar(null)}
          />
        )}

        {/* Add Grammar Form */}
        {showAddForm && (
          <AddGrammarForm
            boardId={boardId}
            onSuccess={() => {
              setShowAddForm(false);
              refetchBoard();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Grammar Form */}
        {editGrammar && (
          <EditGrammarForm
            grammar={editGrammar}
            onSuccess={() => {
              setEditGrammar(null);
              refetchBoard();
            }}
            onCancel={() => setEditGrammar(null)}
          />
        )}

        {/* Error Dialog */}
        <ErrorDialog
          isOpen={showErrorDialog}
          title={errorTitle}
          message={errorMessage}
          onClose={() => setShowErrorDialog(false)}
        />

        {/* Delete Grammar Dialog */}
        <DeleteGrammarDialog
          grammar={deleteGrammar}
          isOpen={!!deleteGrammar}
          onClose={() => setDeleteGrammar(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
