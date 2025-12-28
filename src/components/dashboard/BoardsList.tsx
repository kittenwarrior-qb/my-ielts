import { useBoards } from '../../hooks/useData';
import { FileText, MessageSquare, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BoardsListProps {
  type: 'grammar' | 'vocabulary' | 'idioms';
}

const iconMap = {
  grammar: BookOpen,
  vocabulary: FileText,
  idioms: MessageSquare,
};

export default function BoardsList({ type }: BoardsListProps) {
  const { data: boards, isLoading } = useBoards(type);
  const location = useLocation();
  const Icon = iconMap[type];

  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-3 py-2 bg-gray-100 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return null;
  }

  const baseUrl = type === 'idioms' ? 'expressions' : type;

  return (
    <div className="space-y-1">
      {boards.map((board) => {
        const boardPath = `/dashboard/${baseUrl}/${board.id}`;
        const isActive = location.pathname === boardPath;
        
        return (
          <Link
            key={board.id}
            to={boardPath}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded truncate ${
              isActive 
                ? 'bg-gray-100 text-black font-medium' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{board.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
