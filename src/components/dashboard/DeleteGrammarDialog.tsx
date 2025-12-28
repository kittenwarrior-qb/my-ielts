import { useState } from 'react';
import { X } from 'lucide-react';

interface Grammar {
  id: string;
  title: string;
}

interface DeleteGrammarDialogProps {
  grammar: Grammar | null;
  lessonId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteGrammarDialog({
  grammar,
  lessonId,
  onClose,
  onConfirm,
}: DeleteGrammarDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!grammar) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      // Delete grammar item
      const deleteRes = await fetch(`/api/grammar/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grammar.id }),
      });

      if (!deleteRes.ok) {
        const data = await deleteRes.json();
        throw new Error(data.error || 'Failed to delete grammar');
      }

      // Remove from lesson
      const lessonRes = await fetch(`/api/lessons/${lessonId}`);
      if (lessonRes.ok) {
        const lesson = await lessonRes.json();
        const itemIds = (lesson.itemIds as string[]).filter(id => id !== grammar.id);
        
        await fetch(`/api/lessons/${lessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds }),
        });
      }

      onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete grammar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Xác nhận xóa</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Bạn có chắc chắn muốn xóa ngữ pháp <strong>{grammar.title}</strong>?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
