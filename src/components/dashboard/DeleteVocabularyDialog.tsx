import { AlertTriangle } from 'lucide-react';

interface DeleteVocabularyDialogProps {
  vocabulary: { id: string; word: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteVocabularyDialog({ 
  vocabulary, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteVocabularyDialogProps) {
  if (!isOpen || !vocabulary) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Xác nhận xóa vocabulary
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Bạn có chắc chắn muốn xóa từ <strong>"{vocabulary.word}"</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold transition-all duration-150 active:translate-y-[4px]"
            style={{ boxShadow: '0 4px 0 0 #9ca3af', backgroundColor: 'white' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            onMouseDown={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 #9ca3af')}
            onMouseUp={(e) => (e.currentTarget.style.boxShadow = '0 4px 0 0 #9ca3af')}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 text-white rounded-lg font-bold transition-all duration-150 active:translate-y-[4px]"
            style={{ backgroundColor: '#dc2626', boxShadow: '0 4px 0 0 #991b1b' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            onMouseDown={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 #991b1b')}
            onMouseUp={(e) => (e.currentTarget.style.boxShadow = '0 4px 0 0 #991b1b')}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
