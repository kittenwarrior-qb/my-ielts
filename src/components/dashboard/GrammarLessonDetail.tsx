import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AddGrammarForm from '../admin/AddGrammarForm';
import EditGrammarForm from '../admin/EditGrammarForm';
import DeleteGrammarDialog from './DeleteGrammarDialog';
import ErrorDialog from './ErrorDialog';

import type { Grammar as GrammarType } from '../../lib/db/schema';

interface Lesson {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  order: number;
  itemIds: string[];
}

interface Grammar {
  id: string;
  title: string;
  structure: string;
  explanation: string;
  examples: string[];
  usage: string | null;
  notes: string | null;
  level: string;
}

async function fetchLessonWithGrammar(lessonId: string) {
  const lessonRes = await fetch(`/api/lessons/${lessonId}`);
  if (!lessonRes.ok) throw new Error('Failed to fetch lesson');
  
  const lesson: Lesson = await lessonRes.json();
  const itemIds = lesson.itemIds as string[];
  
  if (itemIds.length === 0) {
    return { lesson, grammarItems: [] };
  }

  const grammarRes = await fetch(`/api/grammar/by-ids?ids=${itemIds.join(',')}`);
  if (!grammarRes.ok) throw new Error('Failed to fetch grammar items');
  
  const grammarItems: Grammar[] = await grammarRes.json();
  
  return { lesson, grammarItems };
}

export default function GrammarLessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editGrammar, setEditGrammar] = useState<Grammar | null>(null);
  const [deleteGrammar, setDeleteGrammar] = useState<Grammar | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Không có quyền');
  const menuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['lesson-detail', id],
    queryFn: () => fetchLessonWithGrammar(id!),
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

  const handleEdit = (grammar: Grammar) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorTitle('Không có quyền');
      setErrorMessage('Bạn không có quyền chỉnh sửa grammar.\n\nChỉ Admin mới có thể chỉnh sửa grammar.');
      setShowErrorDialog(true);
      return;
    }

    setEditGrammar(grammar);
  };

  const handleDelete = (grammar: Grammar) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorTitle('Không có quyền');
      setErrorMessage('Bạn không có quyền xóa grammar.\n\nChỉ Admin mới có thể xóa grammar.');
      setShowErrorDialog(true);
      return;
    }

    setDeleteGrammar(grammar);
  };

  const handleAddClick = () => {
    if (!isAdmin) {
      setErrorTitle('Không có quyền');
      setErrorMessage('Bạn không có quyền thêm grammar.\n\nChỉ Admin mới có thể thêm grammar.');
      setShowErrorDialog(true);
      return;
    }

    setShowAddForm(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.lesson) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Lesson not found</p>
        </div>
      </div>
    );
  }

  const { lesson, grammarItems } = data;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/dashboard/grammar/board/${lesson.boardId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Board
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-gray-600">{lesson.description}</p>
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
              Thêm ngữ pháp
            </button>
          </div>
        </div>

        {/* Grammar Items */}
        <div className="space-y-4">
          {grammarItems.map((item) => (
            <div key={item.id} className="border border-gray-200 bg-white p-6 relative group">
              {/* Menu Button */}
              <div className="absolute top-4 right-4" ref={menuOpenId === item.id ? menuRef : null}>
                <button
                  onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {menuOpenId === item.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Level */}
              <div className="mb-4 pr-10">
                <h2 className="text-xl font-bold text-black mb-2">{item.title}</h2>
                <div className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {item.level}
                </div>
              </div>

              {/* Structure */}
              <div className="mb-4 p-3 bg-gray-50 border-l-4 border-gray-900">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Structure</div>
                <div className="font-mono text-sm text-black">{item.structure}</div>
              </div>

              {/* Explanation */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Explanation</div>
                <p className="text-gray-700">{item.explanation}</p>
              </div>

              {/* Examples */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Examples</div>
                <div className="space-y-2">
                  {item.examples.map((example, idx) => {
                    const [english, vietnamese] = example.split('\n');
                    return (
                      <div key={idx} className="p-3 bg-gray-50 border border-gray-200">
                        <div className="font-medium text-black mb-1">{english}</div>
                        {vietnamese && (
                          <div className="text-sm text-gray-600 italic">{vietnamese}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Usage */}
              {item.usage && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Usage</div>
                  <p className="text-gray-700">{item.usage}</p>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div className="p-3 bg-gray-50 border-l-4 border-gray-400">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Note</div>
                  <p className="text-sm text-gray-700">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {grammarItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có ngữ pháp nào</p>
            <p className="text-sm text-gray-400">Nhấn "Thêm ngữ pháp" để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddGrammarForm
          boardId={lesson.boardId}
          lessonId={lesson.id}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            refetch();
          }}
        />
      )}

      {editGrammar && (
        <EditGrammarForm
          grammar={editGrammar as GrammarType}
          onClose={() => setEditGrammar(null)}
          onSuccess={() => {
            setEditGrammar(null);
            refetch();
          }}
        />
      )}

      {deleteGrammar && (
        <DeleteGrammarDialog
          grammar={deleteGrammar}
          lessonId={lesson.id}
          onClose={() => setDeleteGrammar(null)}
          onConfirm={() => {
            setDeleteGrammar(null);
            refetch();
          }}
        />
      )}

      <ErrorDialog
        isOpen={showErrorDialog}
        title={errorTitle}
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
      />
    </div>
  );
}
