import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  type: 'vocabulary' | 'grammar' | 'expressions';
  itemId: string;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  type,
  itemId,
  itemName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = `/ api/${type}/delete/${itemId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete item');
      }

      onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'vocabulary':
        return 'vocabulary';
      case 'grammar':
        return 'grammar';
      case 'expressions':
        return 'expression';
      default:
        return 'item';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Xác nhận xóa {getTypeLabel()}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Bạn có chắc chắn muốn xóa <strong>"{itemName}"</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Item này sẽ bị xóa khỏi tất cả các boards. Hành động này không thể hoàn tác.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold disabled:opacity-50 transition-all duration-150 active:translate-y-[4px]"
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
            className="px-6 py-3 text-white rounded-lg font-bold disabled:bg-red-400 flex items-center gap-2 transition-all duration-150 active:translate-y-[4px]"
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
  );
}
