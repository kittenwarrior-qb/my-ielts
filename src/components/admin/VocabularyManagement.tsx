import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { Button, Input, Badge, Modal } from '../ui';
import Pagination from '../Pagination';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';

interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  types: Array<{ type: string; meanings: string[] }>;
  level: string;
  band: number;
  topics: string[];
  createdAt: string;
}

interface VocabularyManagementProps {
  initialData: VocabularyItem[];
  initialPage: number;
  totalPages: number;
  total: number;
  initialSearch?: string;
}

export default function VocabularyManagement({
  initialData,
  initialPage,
  totalPages,
  total,
  initialSearch = '',
}: VocabularyManagementProps) {
  const [search, setSearch] = useState(initialSearch);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    window.location.href = `/admin/vocabulary?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    window.location.href = `/admin/vocabulary?${params.toString()}`;
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/vocabulary/${deleteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        success('Vocabulary deleted successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        error(result.error || 'Failed to delete vocabulary');
      }
    } catch (err) {
      error('Failed to delete vocabulary');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const levelColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  } as const;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Manage Vocabulary
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {total} vocabulary words
          </p>
        </div>
        <Button
          onClick={() => window.location.href = '/admin/vocabulary/new'}
          variant="primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Word
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vocabulary..."
          className="flex-1"
        />
        <Button type="submit" variant="primary">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        {search && (
          <Button
            type="button"
            onClick={() => {
              setSearch('');
              window.location.href = '/admin/vocabulary';
            }}
            variant="secondary"
          >
            Clear
          </Button>
        )}
      </form>

      {/* Vocabulary Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Word
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phonetic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Band
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Topics
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {initialData.map((vocab) => (
                <tr key={vocab.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {vocab.word}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {vocab.phonetic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={levelColors[vocab.level as keyof typeof levelColors]} size="sm">
                      {vocab.level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary" size="sm">
                      {vocab.band}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {vocab.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="default" size="sm">
                          {topic}
                        </Badge>
                      ))}
                      {vocab.topics.length > 2 && (
                        <Badge variant="default" size="sm">
                          +{vocab.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/vocabulary/${vocab.word}`}
                        target="_blank"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={`/admin/vocabulary/edit/${vocab.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setDeleteId(vocab.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {initialData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No vocabulary found
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={initialPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Vocabulary"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this vocabulary? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleDelete}
              variant="danger"
              className="flex-1"
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button
              onClick={() => setDeleteId(null)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
