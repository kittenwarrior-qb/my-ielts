import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import ErrorDialog from './ErrorDialog';

interface Board {
  id: string;
  name: string;
  description: string | null;
  type: string;
}

interface EditBoardModalProps {
  board: Board | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBoardModal({ board, isOpen, onClose, onSuccess }: EditBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description || '');
    }
  }, [board]);

  if (!isOpen || !board) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401 || response.status === 403) {
          setErrorDialogMessage(result.error || 'Bạn không có quyền thực hiện thao tác này');
          setShowErrorDialog(true);
          onClose();
        } else {
          setError(result.error || 'Failed to update board');
        }
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chỉnh sửa Board</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Board *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold transition-all duration-150 active:translate-y-[4px]"
                style={{ boxShadow: '0 4px 0 0 #9ca3af', backgroundColor: 'white' }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = 'white')}
                onMouseDown={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 0 0 #9ca3af')}
                onMouseUp={(e) => !loading && (e.currentTarget.style.boxShadow = '0 4px 0 0 #9ca3af')}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white rounded-lg font-bold disabled:bg-gray-400 flex items-center gap-2 transition-all duration-150 active:translate-y-[4px]"
                style={{ backgroundColor: '#FF6B6B', boxShadow: '0 4px 0 0 #CC3333' }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FA5252')}
                onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FF6B6B')}
                onMouseDown={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333')}
                onMouseUp={(e) => !loading && (e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333')}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>

      <ErrorDialog
        isOpen={showErrorDialog}
        title="Không có quyền"
        message={errorDialogMessage}
        onClose={() => setShowErrorDialog(false)}
      />
    </div>
  );
}
