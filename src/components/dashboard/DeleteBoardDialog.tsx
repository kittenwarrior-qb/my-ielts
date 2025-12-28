import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ErrorDialog from './ErrorDialog';

interface Board {
  id: string;
  name: string;
}

interface DeleteBoardDialogProps {
  board: Board | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBoardDialog({ board, isOpen, onClose, onConfirm }: DeleteBoardDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  if (!isOpen || !board) return null;

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401 || response.status === 403) {
          setErrorDialogMessage(result.error || 'Bạn không có quyền thực hiện thao tác này');
          setShowErrorDialog(true);
        } else {
          setErrorDialogMessage(result.error || 'Không thể xóa board');
          setShowErrorDialog(true);
        }
        return;
      }

      onConfirm();
    } catch (err) {
      setErrorDialogMessage(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Xác nhận xóa board
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Bạn có chắc chắn muốn xóa board <strong>"{board.name}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
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
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 text-white rounded-lg font-bold flex items-center gap-2 transition-all duration-150 active:translate-y-[4px]"
              style={{ backgroundColor: '#dc2626', boxShadow: '0 4px 0 0 #991b1b' }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#dc2626')}
              onMouseDown={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 0 0 #991b1b')}
              onMouseUp={(e) => !loading && (e.currentTarget.style.boxShadow = '0 4px 0 0 #991b1b')}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Xóa
            </button>
          </div>
        </div>
      </div>

      <ErrorDialog
        isOpen={showErrorDialog}
        title="Không thể xóa"
        message={errorDialogMessage}
        onClose={() => {
          setShowErrorDialog(false);
          onClose();
        }}
      />
    </>
  );
}
