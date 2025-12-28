import { useBoards } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function VocabularyBoardsGrid() {
  const { data: boards, isLoading } = useBoards('vocabulary');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (boardId: string) => {
    if (confirm('Bạn có chắc muốn xóa board này?')) {
      // TODO: Implement delete with admin check
      console.log('Delete board:', boardId);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">Vocabulary Boards</h1>
          <p className="text-gray-600">Quản lý bộ từ vựng của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards?.map((board) => (
            <div key={board.id} className="relative group">
              <Link
                to={`/dashboard/vocabulary/${board.id}`}
                className="block border border-gray-200 bg-white p-6 hover:bg-gray-50"
              >
                <h3 className="font-semibold text-black mb-2">{board.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {board.description || 'Không có mô tả'}
                </p>
                <div className="text-xs text-gray-500">
                  {(board.itemIds as string[]).length} từ vựng
                </div>
              </Link>
              
              {/* Settings Menu */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(menuOpen === board.id ? null : board.id);
                  }}
                  className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {menuOpen === board.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      onClick={() => handleDelete(board.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa board
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {boards?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có bộ từ nào</p>
            <p className="text-sm text-gray-400">Nhấn "Tạo bộ từ mới" để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
