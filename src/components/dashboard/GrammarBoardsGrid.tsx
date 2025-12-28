import { useBoards } from '../../hooks/useData';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import DeleteBoardDialog from './DeleteBoardDialog';
import BoardCard from './BoardCard';

interface Board {
  id: string;
  name: string;
  description: string | null;
  type: string;
  itemIds: unknown;
}

export default function GrammarBoardsGrid() {
  const { data: boards, isLoading, refetch } = useBoards('grammar');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<Board | null>(null);
  const [deleteBoard, setDeleteBoard] = useState<Board | null>(null);

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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Grammar Boards</h1>
            <p className="text-gray-600">Quản lý bộ ngữ pháp của bạn</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
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
            Tạo bộ từ mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards?.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              linkTo={`/dashboard/grammar/${board.id}`}
              onEdit={setEditBoard}
              onDelete={setDeleteBoard}
            />
          ))}
        </div>

        {boards?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có bộ ngữ pháp nào</p>
            <p className="text-sm text-gray-400">Nhấn "Tạo bộ từ mới" để bắt đầu</p>
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
    </div>
  );
}
