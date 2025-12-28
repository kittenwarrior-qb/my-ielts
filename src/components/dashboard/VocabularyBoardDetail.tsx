import { useQuery } from '@tanstack/react-query';
import type { Board, Vocabulary } from '@/lib/db/schema';
import { Plus, MoreVertical, Edit, Trash2, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import VocabularyDetailModal from './VocabularyDetailModal';
import AddVocabularyForm from '../admin/AddVocabularyForm';
import EditVocabularyForm from '../admin/EditVocabularyForm';
import ErrorDialog from './ErrorDialog';
import DeleteVocabularyDialog from './DeleteVocabularyDialog';
import { useAdmin } from '../../contexts/AdminContext';

interface VocabularyBoardDetailProps {
  boardId: string;
}

// Map part of speech to abbreviations
function abbreviatePartOfSpeech(pos: string): string {
  const mapping: Record<string, string> = {
    'adjective': 'adj',
    'verb': 'v',
    'noun': 'n',
    'adverb': 'adv',
    'pronoun': 'pron',
    'preposition': 'prep',
    'conjunction': 'conj',
    'interjection': 'interj',
    'determiner': 'det',
    'article': 'art',
  };
  
  const lower = pos.toLowerCase();
  return mapping[lower] || pos;
}

async function fetchBoardWithItems(boardId: string) {
  const [boardRes, vocabRes] = await Promise.all([
    fetch(`/api/boards/${boardId}`),
    fetch('/api/vocabulary'),
  ]);

  if (!boardRes.ok) throw new Error('Failed to fetch board');
  if (!vocabRes.ok) throw new Error('Failed to fetch vocabulary');

  const board: Board = await boardRes.json();
  const allVocabulary: Vocabulary[] = await vocabRes.json();

  const itemIds = board.itemIds as string[];
  const vocabulary = allVocabulary
    .filter(v => itemIds.includes(v.id))
    .sort((a, b) => a.word.localeCompare(b.word)); // Sort alphabetically

  return { board, vocabulary };
}

export default function VocabularyBoardDetail({ boardId }: VocabularyBoardDetailProps) {
  const { isAdmin } = useAdmin();
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editVocab, setEditVocab] = useState<Vocabulary | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Không có quyền');
  const [deleteVocab, setDeleteVocab] = useState<Vocabulary | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['board-detail', boardId],
    queryFn: () => fetchBoardWithItems(boardId),
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

  const handleEdit = (vocab: Vocabulary) => {
    setMenuOpenId(null);
    
    if (!isAdmin) {
      setErrorTitle('Không có quyền');
      setErrorMessage('Bạn không có quyền chỉnh sửa vocabulary.\n\nChỉ Admin mới có thể chỉnh sửa vocabulary.');
      setShowErrorDialog(true);
      return;
    }
    
    // Admin: mở EditVocabularyForm
    setEditVocab(vocab);
  };

  const handleDelete = (vocab: Vocabulary) => {
    setMenuOpenId(null);
    setDeleteVocab(vocab);
  };

  const playAudio = (audioUrl: string, vocabId: string) => {
    if (playingAudio === vocabId) {
      // Stop if already playing
      audioRef.current?.pause();
      setPlayingAudio(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAudio(vocabId);

    audio.play();
    audio.onended = () => {
      setPlayingAudio(null);
    };
    audio.onerror = () => {
      setPlayingAudio(null);
      console.error('Failed to play audio');
    };
  };

  const confirmDelete = async () => {
    if (!deleteVocab) return;

    try {
      const response = await fetch(`/api/vocabulary/${deleteVocab.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401 || response.status === 403) {
          setErrorTitle('Không có quyền');
          setErrorMessage(result.error || 'Bạn không có quyền thực hiện thao tác này');
          setShowErrorDialog(true);
        } else {
          setErrorTitle('Lỗi');
          setErrorMessage(result.error || 'Không thể xóa vocabulary');
          setShowErrorDialog(true);
        }
        setDeleteVocab(null);
        return;
      }

      setDeleteVocab(null);
      refetch();
    } catch (err) {
      setErrorTitle('Lỗi');
      setErrorMessage(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setShowErrorDialog(true);
      setDeleteVocab(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { board, vocabulary } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-base text-gray-600 mb-3">
            <a href="/dashboard/vocabulary" className="hover:text-black">Vocabulary</a>
            <span>/</span>
            <span className="truncate font-medium">{board.name}</span>
          </div>
          <h1 className="text-2xl font-bold mb-3">{board.name}</h1>
          <p className="text-lg text-gray-600">{board.description || 'Không có mô tả'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold transition-all duration-150 whitespace-nowrap active:translate-y-[4px]"
            style={{ 
              backgroundColor: '#FF6B6B', 
              fontSize: '1rem',
              boxShadow: '0 4px 0 0 #CC3333'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FA5252'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333'}
          >
            <Plus className="w-5 h-5" />
            Thêm Vocabulary
          </button>
        </div>

        {/* Desktop Table / Mobile Cards */}
        <div className="hidden md:block border border-gray-200 bg-white rounded-xl overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase w-[20%]">Từ ngữ</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase w-[10%]">Loại từ</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase w-[20%]">Phiên âm</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase w-[42%]">Ý nghĩa</th>
                <th className="px-4 py-4 w-[8%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vocabulary.map((item) => {
                const types = item.types as any;
                const firstType = Array.isArray(types) ? types[0] : null;
                const firstMeaning = firstType?.meanings?.[0] || '';
                const partOfSpeech = firstType?.type ? abbreviatePartOfSpeech(firstType.type) : '-';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="px-4 py-4" onClick={() => setSelectedVocab(item)}>
                      <div className="flex items-center gap-2">
                        <span className="hover:underline font-bold text-lg cursor-pointer line-clamp-2">
                          {item.word}
                        </span>
                        {item.audioUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(item.audioUrl!, item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity flex-shrink-0"
                            title="Play pronunciation"
                          >
                            <Volume2 className={`w-4 h-4 ${playingAudio === item.id ? 'text-blue-600' : 'text-gray-600'}`} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-base text-gray-600" onClick={() => setSelectedVocab(item)}>
                      <span className="line-clamp-2">{partOfSpeech}</span>
                    </td>
                    <td className="px-4 py-4 text-base text-gray-600" onClick={() => setSelectedVocab(item)}>
                      <span className="line-clamp-2">{item.phonetic}</span>
                    </td>
                    <td className="px-4 py-4 text-base" onClick={() => setSelectedVocab(item)}>
                      <span className="line-clamp-2">{firstMeaning}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative" ref={menuOpenId === item.id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === item.id ? null : item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {menuOpenId === item.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {vocabulary.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3">
          {vocabulary.map((item) => {
            const types = item.types as any;
            const firstType = Array.isArray(types) ? types[0] : null;
            const firstMeaning = firstType?.meanings?.[0] || '';
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 relative group"
              >
                {/* Three dots menu */}
                <div className="absolute top-4 right-4" ref={menuOpenId === item.id ? menuRef : null}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === item.id ? null : item.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-opacity"
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

                <div onClick={() => setSelectedVocab(item)} className="cursor-pointer">
                  {/* Word + Audio */}
                  <div className="flex items-start justify-between mb-3 pr-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{item.word}</h3>
                      <p className="text-base text-gray-500">{item.phonetic}</p>
                    </div>
                    {item.audioUrl && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.audioUrl!, item.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Volume2 className={`w-6 h-6 ${playingAudio === item.id ? 'text-blue-600' : 'text-gray-600'}`} />
                      </button>
                    )}
                  </div>

                  {/* Meaning */}
                  <div className="mb-3">
                    <p className="text-lg leading-relaxed">{firstMeaning}</p>
                  </div>

                  {/* Grammar Note */}
                  {item.grammar && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {item.grammar}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {vocabulary.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-lg font-medium text-gray-600">
          {vocabulary.length} từ vựng
        </div>

        {/* Vocabulary Detail Modal */}
        {selectedVocab && (
          <VocabularyDetailModal
            vocabulary={selectedVocab}
            isOpen={!!selectedVocab}
            onClose={() => setSelectedVocab(null)}
          />
        )}

        {/* Add Vocabulary Form */}
        {showAddForm && (
          <AddVocabularyForm
            boardId={boardId}
            onSuccess={() => {
              setShowAddForm(false);
              refetch();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Vocabulary Form */}
        {editVocab && (
          <EditVocabularyForm
            vocabulary={editVocab}
            onSuccess={() => {
              setEditVocab(null);
              refetch();
            }}
            onCancel={() => setEditVocab(null)}
          />
        )}

        {/* Error Dialog */}
        <ErrorDialog
          isOpen={showErrorDialog}
          title={errorTitle}
          message={errorMessage}
          onClose={() => setShowErrorDialog(false)}
        />

        {/* Delete Vocabulary Dialog */}
        <DeleteVocabularyDialog
          vocabulary={deleteVocab}
          isOpen={!!deleteVocab}
          onClose={() => setDeleteVocab(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
