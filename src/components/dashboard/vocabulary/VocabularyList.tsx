import { useState, useMemo } from 'react';
import type { Vocabulary } from '@/lib/db/schema';
import Toolbar from '../Toolbar';
import ListView from '../ListView';
import VocabularyFormModal from './VocabularyFormModal';
import Badge from '@/components/ui/badge';

interface VocabularyListProps {
  vocabulary: Vocabulary[];
}

export default function VocabularyList({ vocabulary: initialVocabulary }: VocabularyListProps) {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>(initialVocabulary);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Vocabulary | null>(null);

  // Get unique topics and levels
  const topics = useMemo(() => {
    const allTopics = vocabulary.flatMap(v => {
      const topics = v.topics;
      return Array.isArray(topics) ? topics : [];
    });
    return ['all', ...Array.from(new Set(allTopics))];
  }, [vocabulary]);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter vocabulary
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof item.types === 'object' && JSON.stringify(item.types).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const itemTopics = Array.isArray(item.topics) ? item.topics : [];
      const matchesTopic = selectedTopic === 'all' || itemTopics.includes(selectedTopic);
      
      const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;

      return matchesSearch && matchesTopic && matchesLevel;
    });
  }, [vocabulary, searchTerm, selectedTopic, selectedLevel]);

  const columns = [
    {
      key: 'word',
      label: 'TERM',
      width: '20%',
      render: (item: Vocabulary) => (
        <div>
          <div className="font-semibold text-foreground">{item.word}</div>
          <div className="text-sm text-muted-foreground">{item.phonetic}</div>
        </div>
      ),
    },
    {
      key: 'meaning',
      label: 'MEANING',
      width: '25%',
      render: (item: Vocabulary) => {
        const types = item.types as any;
        const firstMeaning = Array.isArray(types) && types[0]?.meanings?.[0];
        return (
          <div className="text-foreground truncate">
            {firstMeaning || 'No meaning'}
          </div>
        );
      },
    },
    {
      key: 'grammar',
      label: 'GRAMMAR',
      width: '20%',
      render: (item: Vocabulary) => (
        <div className="text-sm text-muted-foreground truncate">
          {item.grammar || '-'}
        </div>
      ),
    },
    {
      key: 'topics',
      label: 'TOPICS',
      width: '20%',
      render: (item: Vocabulary) => {
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
    {
      key: 'band',
      label: 'BAND',
      width: '15%',
      render: (item: Vocabulary) => (
        <Badge variant="primary">{item.band}</Badge>
      ),
    },
  ];

  const filters = [
    {
      label: 'Chủ đề',
      value: selectedTopic,
      onChange: setSelectedTopic,
      options: topics.map(t => ({ label: t === 'all' ? 'Tất cả' : t, value: t })),
    },
    {
      label: 'Cấp độ',
      value: selectedLevel,
      onChange: setSelectedLevel,
      options: levels.map(l => ({ 
        label: l === 'all' ? 'Tất cả' : l.charAt(0).toUpperCase() + l.slice(1), 
        value: l 
      })),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: Vocabulary) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = async (item: Vocabulary) => {
    if (confirm(`Bạn có chắc muốn xóa từ "${item.word}"?`)) {
      try {
        const response = await fetch(`/api/vocabulary/${item.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setVocabulary(prev => prev.filter(v => v.id !== item.id));
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      const url = editingItem 
        ? `/api/vocabulary/${editingItem.id}` 
        : '/api/vocabulary';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedItem = await response.json();
        
        if (editingItem) {
          setVocabulary(prev => prev.map(v => v.id === editingItem.id ? savedItem : v));
        } else {
          setVocabulary(prev => [...prev, savedItem]);
        }
        
        setShowAddModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleItemClick = (item: Vocabulary) => {
    window.location.href = `/vocabulary/${item.word}`;
  };

  return (
    <div className="space-y-6">
      <Toolbar
        title="Từ vựng"
        itemCount={filteredVocabulary.length}
        onAdd={handleAdd}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
      />

      <ListView
        items={filteredVocabulary}
        columns={columns}
        onItemClick={handleItemClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <VocabularyFormModal
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
