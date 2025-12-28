import { Info } from 'lucide-react';

interface InfoDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function InfoDialog({ isOpen, title, message, onClose }: InfoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-white rounded-lg font-bold transition-all duration-150 active:translate-y-[4px]"
            style={{ backgroundColor: '#FF6B6B', boxShadow: '0 4px 0 0 #CC3333' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FA5252'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333'}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
