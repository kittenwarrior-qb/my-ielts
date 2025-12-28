import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import DeleteBoardDialog from './DeleteBoardDialog';
import ErrorDialog from './ErrorDialog';

interface Board {
  id: string;
  name: string;
  description: string | null;
  type: string;
  color: string | null;
  icon: string | null;
  order: number;
  itemIds: unknown;
}

interface Lesson {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  order: number;
}

export default function GrammarBoardsGrid() {
  const { isAdmin } = useAdmin();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<Board | null>(null);
  const [deleteBoard, setDeleteBoard] = useState<Board | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: boards = [], isLoading, refetch } = useQuery<Board[]>({
    queryKey: ['boards', 'grammar'],
    queryFn: async () => {
      const response = await fetch('/api/boards?type=grammar');
      if (!response.ok) throw new Error('Failed to fetch boards');
      return response.json();
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpenId]);

  const handleEdit = (board: Board) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền chỉnh sửa board.\n\nChỉ Admin mới có thể chỉnh sửa board.');
      setShowErrorDialog(true);
      return;
    }

    setEditBoard(board);
  };

  const handleDelete = (board: Board) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền xóa board.\n\nChỉ Admin mới có thể xóa board.');
      setShowErrorDialog(true);
      return;
    }

    setDeleteBoard(board);
  };

  const handleAddClick = () => {
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền tạo board.\n\nChỉ Admin mới có thể tạo board.');
      setShowErrorDialog(true);
      return;
    }

    setCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Grammar Boards</h1>
            <p className="text-gray-600">Quản lý bộ ngữ pháp của bạn</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold transition-all duration-150 active:translate-y-[4px]"
            style={{ backgroundColor: '#FF6B6B', boxShadow: '0 4px 0 0 #CC3333' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#FA5252';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B6B';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333';
            }}
          >
            <Plus className="w-5 h-5" />
            Tạo board mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onEdit={handleEdit}
              onDelete={handleDelete}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              menuRef={menuRef}
            />
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có bộ ngữ pháp nào</p>
            <p className="text-sm text-gray-400">Nhấn "Tạo board mới" để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBoardModal
        type="grammar"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          refetch();
        }}
      />

      <EditBoardModal
        board={editBoard}
        isOpen={!!editBoard}
        onClose={() => setEditBoard(null)}
        onSuccess={() => {
          setEditBoard(null);
          refetch();
        }}
      />

      <DeleteBoardDialog
        board={deleteBoard}
        isOpen={!!deleteBoard}
        onClose={() => setDeleteBoard(null)}
        onConfirm={() => {
          setDeleteBoard(null);
          refetch();
        }}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        title="Không có quyền"
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
      />
    </div>
  );
}

interface BoardCardProps {
  board: Board;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
  menuOpenId: string | null;
  setMenuOpenId: (id: string | null) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

function BoardCard({ board, onEdit, onDelete, menuOpenId, setMenuOpenId, menuRef }: BoardCardProps) {
  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['lessons', board.id],
    queryFn: async () => {
      const response = await fetch(`/api/lessons?boardId=${board.id}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return response.json();
    },
  });

  return (
    <div className="relative group">
      <Link
        to={`/dashboard/grammar/board/${board.id}`}
        className="block border border-gray-200 bg-white p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-black flex-1">{board.name}</h3>
          
          <div className="relative" ref={menuOpenId === board.id ? menuRef : null}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpenId(menuOpenId === board.id ? null : board.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {menuOpenId === board.id && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(board);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(board);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {board.description || 'Không có mô tả'}
        </p>

        <div className="text-xs text-gray-500">
          {lessons.length} lessons
        </div>
      </Link>
    </div>
  );
}
