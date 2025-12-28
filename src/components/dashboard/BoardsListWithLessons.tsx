import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Board {
  id: string;
  name: string;
  type: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  order: number;
}

interface Lesson {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  order: number;
}

interface BoardsListWithLessonsProps {
  type: 'grammar' | 'vocabulary' | 'idioms';
}

export default function BoardsListWithLessons({ type }: BoardsListWithLessonsProps) {
  const location = useLocation();
  const [expandedBoards, setExpandedBoards] = useState<Set<string>>(new Set());

  // Fetch boards
  const { data: boards = [] } = useQuery<Board[]>({
    queryKey: ['boards', type],
    queryFn: async () => {
      const response = await fetch(`/api/boards?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch boards');
      return response.json();
    },
  });

  const toggleBoard = (boardId: string) => {
    setExpandedBoards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(boardId)) {
        newSet.delete(boardId);
      } else {
        newSet.add(boardId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-1">
      {boards.map(board => (
        <BoardItem
          key={board.id}
          board={board}
          type={type}
          isExpanded={expandedBoards.has(board.id)}
          onToggle={() => toggleBoard(board.id)}
          currentPath={location.pathname}
        />
      ))}
    </div>
  );
}

interface BoardItemProps {
  board: Board;
  type: string;
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

function BoardItem({ board, type, isExpanded, onToggle, currentPath }: BoardItemProps) {
  // Fetch lessons only when expanded
  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['lessons', board.id],
    queryFn: async () => {
      const response = await fetch(`/api/lessons?boardId=${board.id}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return response.json();
    },
    enabled: isExpanded,
  });

  const boardPath = `/dashboard/${type}/board/${board.id}`;
  const isBoardActive = currentPath === boardPath;

  return (
    <div>
      {/* Board Header - Combined hover effect for button and link */}
      <div className="flex items-center group">
        <button
          onClick={onToggle}
          className="p-1.5 ml-1 rounded-sm hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          )}
        </button>
        <Link
          to={boardPath}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded truncate ${
            isBoardActive 
              ? 'bg-gray-100 shadow-sm' 
              : 'hover:bg-gray-50'
          }`}
        >
          <span className="truncate block">{board.name}</span>
        </Link>
      </div>

      {/* Lessons List with left border */}
      {isExpanded && lessons.length > 0 && (
        <div className="ml-6 space-y-1 mt-1 mb-2 pl-3 border-l-2 border-gray-300 relative">
          {lessons.map(lesson => {
            const lessonPath = `/dashboard/${type}/lesson/${lesson.id}`;
            const isActive = currentPath === lessonPath;

            return (
              <Link
                key={lesson.id}
                to={lessonPath}
                className={`block px-3 py-1.5 text-sm rounded truncate ${
                  isActive 
                    ? 'bg-gray-100 font-medium shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                title={lesson.title}
              >
                {lesson.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
