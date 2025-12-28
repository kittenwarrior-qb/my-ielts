import { useState, useMemo } from 'react';
import type { Expression } from '@/lib/db/schema';
import Toolbar from '../Toolbar';
import ListView from '../ListView';
import ExpressionsFormModal from './ExpressionsFormModal';
import Badge from '@/components/ui/badge';
import { ToastContainer } from '@/components/ui/Toast';
import type { ToastType } from '@/components/ui/Toast';

interface ExpressionsListProps {
  expressions: Expression[];
}

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export default function ExpressionsList({ expressions: initialExpressions }: ExpressionsListProps) {
  const [expressions, setExpressions] = useState<Expression[]>(initialExpressions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Expression | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Get unique topics
  const topics = useMemo(() => {
    const allTopics = expressions.flatMap(e => {
      const topics = e.topics;
      return Array.isArray(topics) ? topics : [];
    });
    return ['all', ...Array.from(new Set(allTopics))];
  }, [expressions]);

  // Filter expressions
  const filteredExpressions = useMemo(() => {
    return expressions.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      
      const itemTopics = Array.isArray(item.topics) ? item.topics : [];
      const matchesTopic = selectedTopic === 'all' || itemTopics.includes(selectedTopic);

      return matchesSearch && matchesType && matchesTopic;
    });
  }, [expressions, searchTerm, selectedType, selectedTopic]);

  const columns = [
    {
      key: 'expression',
      label: 'EXPRESSION',
      width: '25%',
      render: (item: Expression) => (
        <div>
          <div className="font-semibold text-black">{item.expression}</div>
          <Badge variant="default" className="text-xs mt-1">
            {item.type === 'idiom' ? 'Idiom' : 'Phrase'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'meaning',
      label: 'MEANING',
      width: '30%',
      render: (item: Expression) => (
        <div className="text-black truncate">
          {item.meaning}
        </div>
      ),
    },
    {
      key: 'grammar',
      label: 'GRAMMAR',
      width: '20%',
      render: (item: Expression) => (
        <div className="text-sm text-gray-600 truncate">
          {item.grammar || '-'}
        </div>
      ),
    },
    {
      key: 'topics',
      label: 'TOPICS',
      width: '25%',
      render: (item: Expression) => {
        const topics = Array.isArray(item.topics) ? item.topics : [];
        return (
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 2).map((topic: string) => (
              <Badge key={topic} variant="default" className="text-xs">
                {topic}
              </Badge>
            ))}
            {topics.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{topics.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      label: 'Loại',
      value: selectedType,
      onChange: setSelectedType,
      options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Idiom', value: 'idiom' },
        { label: 'Phrase', value: 'phrase' },
      ],
    },
    {
      label: 'Chủ đề',
      value: selectedTopic,
      onChange: setSelectedTopic,
      options: topics.map(t => ({ label: t === 'all' ? 'Tất cả' : t, value: t })),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: Expression) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = async (item: Expression) => {
    if (confirm(`Bạn có chắc muốn xóa "${item.expression}"?`)) {
      try {
        const response = await fetch(`/api/expressions/${item.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setExpressions(prev => prev.filter(e => e.id !== item.id));
          showToast('success', `Đã xóa "${item.expression}" thành công`);
        } else {
          showToast('error', 'Không thể xóa expression');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        showToast('error', 'Có lỗi xảy ra khi xóa expression');
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      const url = editingItem 
        ? `/api/expressions/${editingItem.id}` 
        : '/api/expressions';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedItem = await response.json();
        
        if (editingItem) {
          setExpressions(prev => prev.map(e => e.id === editingItem.id ? savedItem : e));
          showToast('success', 'Đã cập nhật expression thành công');
        } else {
          setExpressions(prev => [...prev, savedItem]);
          showToast('success', 'Đã thêm expression mới thành công');
        }
        
        setShowAddModal(false);
        setEditingItem(null);
      } else {
        showToast('error', 'Không thể lưu expression');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showToast('error', 'Có lỗi xảy ra khi lưu expression');
    }
  };

  const handleItemClick = (item: Expression) => {
    if (item.type === 'idiom') {
      window.location.href = `/idioms/${item.expression}`;
    } else {
      window.location.href = `/phrases/${item.expression}`;
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <Toolbar
        title="Expressions"
        itemCount={filteredExpressions.length}
        onAdd={handleAdd}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
      />

      <ListView
        items={filteredExpressions}
        columns={columns}
        onItemClick={handleItemClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ExpressionsFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
}
