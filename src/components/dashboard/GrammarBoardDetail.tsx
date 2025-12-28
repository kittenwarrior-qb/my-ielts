import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import ErrorDialog from './ErrorDialog';
import CreateLessonModal from './CreateLessonModal';
import EditLessonModal from './EditLessonModal';
import DeleteLessonDialog from './DeleteLessonDialog';

interface Board {
  id: string;
  name: string;
  description: string | null;
  type: string;
}

interface Lesson {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  order: number;
  itemIds: string[];
}

async function fetchBoardWithLessons(boardId: string) {
  const [boardRes, lessonsRes] = await Promise.all([
    fetch(`/api/boards/${boardId}`),
    fetch(`/api/lessons?boardId=${boardId}`),
  ]);

  if (!boardRes.ok) throw new Error('Failed to fetch board');
  if (!lessonsRes.ok) throw new Error('Failed to fetch lessons');

  const board: Board = await boardRes.json();
  const lessons: Lesson[] = await lessonsRes.json();

  return { board, lessons };
}

export default function GrammarBoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const { isAdmin } = useAdmin();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['board-lessons', boardId],
    queryFn: () => fetchBoardWithLessons(boardId!),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpenId]);

  const handleEdit = (lesson: Lesson) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền chỉnh sửa lesson.\n\nChỉ Admin mới có thể chỉnh sửa lesson.');
      setShowErrorDialog(true);
      return;
    }

    setEditLesson(lesson);
  };

  const handleDelete = (lesson: Lesson) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền xóa lesson.\n\nChỉ Admin mới có thể xóa lesson.');
      setShowErrorDialog(true);
      return;
    }

    setDeleteLesson(lesson);
  };

  const handleAddClick = () => {
    if (!isAdmin) {
      setErrorMessage('Bạn không có quyền tạo lesson.\n\nChỉ Admin mới có thể tạo lesson.');
      setShowErrorDialog(true);
      return;
    }

    setCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.board) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Board not found</p>
        </div>
      </div>
    );
  }

  const { board, lessons } = data;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/grammar"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Grammar Boards
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{board.name}</h1>
              {board.description && (
                <p className="text-gray-600">{board.description}</p>
              )}
            </div>

            <button
              onClick={handleAddClick}
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
              Thêm lesson
            </button>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="relative group">
              <Link
                to={`/dashboard/grammar/lesson/${lesson.id}`}
                className="block border border-gray-200 bg-white p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-black flex-1">{lesson.title}</h3>
                  
                  <div className="relative" ref={menuOpenId === lesson.id ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === lesson.id ? null : lesson.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {menuOpenId === lesson.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(lesson);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(lesson);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {lesson.description || 'Không có mô tả'}
                </p>

                <div className="text-xs text-gray-500">
                  {(lesson.itemIds || []).length} ngữ pháp
                </div>
              </Link>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có lesson nào</p>
            <p className="text-sm text-gray-400">Nhấn "Thêm lesson" để bắt đầu</p>
          </div>
        )}
      </div>

      <ErrorDialog
        isOpen={showErrorDialog}
        title="Không có quyền"
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
      />

      {/* Modals */}
      <CreateLessonModal
        boardId={boardId!}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          refetch();
        }}
      />

      <EditLessonModal
        lesson={editLesson}
        isOpen={!!editLesson}
        onClose={() => setEditLesson(null)}
        onSuccess={() => {
          setEditLesson(null);
          refetch();
        }}
      />

      <DeleteLessonDialog
        lesson={deleteLesson}
        isOpen={!!deleteLesson}
        onClose={() => setDeleteLesson(null)}
        onConfirm={() => {
          setDeleteLesson(null);
          refetch();
        }}
      />
    </div>
  );
}
