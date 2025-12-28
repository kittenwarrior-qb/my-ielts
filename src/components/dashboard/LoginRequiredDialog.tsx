interface LoginRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredDialog({ isOpen, onClose }: LoginRequiredDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Yêu cầu đăng nhập</h2>
        <p className="text-gray-600 mb-6">
          Bạn cần đăng nhập để tạo board mới. Vui lòng đăng nhập để tiếp tục.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
          >
            Đóng
          </button>
          <a
            href="/login"
            className="px-4 py-2 rounded text-white font-bold transition-all duration-150 active:translate-y-[4px]"
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
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
