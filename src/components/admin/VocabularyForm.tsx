import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '../ui';
import WordFetcher from './WordFetcher';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';
import type { ParsedWordData } from '../../lib/dictionary';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface VocabularyFormProps {
  topics: Topic[];
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function VocabularyForm({ topics, mode, initialData }: VocabularyFormProps) {
  const [formData, setFormData] = useState({
    word: initialData?.word || '',
    phonetic: initialData?.phonetic || '',
    audioUrl: initialData?.audioUrl || '',
    types: initialData?.types || [{ type: 'noun', meanings: [''] }],
    examples: initialData?.examples || [''],
    synonyms: initialData?.synonyms || [],
    wordForms: initialData?.wordForms || [],
    topics: initialData?.topics || [],
    level: initialData?.level || 'intermediate',
    band: initialData?.band || 6.0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const handleWordFetched = (data: ParsedWordData) => {
    setFormData({
      ...formData,
      word: data.word,
      phonetic: data.phonetic,
      audioUrl: data.audioUrl,
      types: data.types.map(t => ({
        type: t.type,
        meanings: t.meanings,
      })),
      examples: data.examples.length > 0 ? data.examples : [''],
      synonyms: data.synonyms,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = mode === 'create' 
        ? '/api/vocabulary/create'
        : `/api/vocabulary/update/${initialData?.id}`;

      const payload = {
        ...formData,
        // Clean up empty strings in arrays
        examples: formData.examples.filter(e => e.trim()),
        synonyms: formData.synonyms.filter(s => s.trim()),
        wordForms: formData.wordForms.filter(w => w.trim()),
        types: formData.types.map(t => ({
          ...t,
          meanings: t.meanings.filter(m => m.trim()),
        })).filter(t => t.meanings.length > 0),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        success(`Vocabulary ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        setTimeout(() => {
          window.location.href = '/admin/vocabulary';
        }, 1000);
      } else {
        error(result.error || `Failed to ${mode} vocabulary`);
      }
    } catch (err) {
      error(`Failed to ${mode} vocabulary`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMeaning = (typeIndex: number) => {
    const newTypes = [...formData.types];
    newTypes[typeIndex].meanings.push('');
    setFormData({ ...formData, types: newTypes });
  };

  const removeMeaning = (typeIndex: number, meaningIndex: number) => {
    const newTypes = [...formData.types];
    newTypes[typeIndex].meanings.splice(meaningIndex, 1);
    setFormData({ ...formData, types: newTypes });
  };

  const addType = () => {
    setFormData({
      ...formData,
      types: [...formData.types, { type: 'noun', meanings: [''] }],
    });
  };

  const removeType = (index: number) => {
    const newTypes = [...formData.types];
    newTypes.splice(index, 1);
    setFormData({ ...formData, types: newTypes });
  };

  const addExample = () => {
    setFormData({ ...formData, examples: [...formData.examples, ''] });
  };

  const removeExample = (index: number) => {
    const newExamples = [...formData.examples];
    newExamples.splice(index, 1);
    setFormData({ ...formData, examples: newExamples });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Word Fetcher (only for create mode) */}
      {mode === 'create' && (
        <Card>
          <WordFetcher onWordFetched={handleWordFetched} />
        </Card>
      )}

      {/* Basic Info */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Basic Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Word"
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            required
          />
          <Input
            label="Phonetic"
            value={formData.phonetic}
            onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
            placeholder="/əˈbʌndənt/"
          />
          <Input
            label="Audio URL (optional)"
            value={formData.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </Card>

      {/* Types & Meanings */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Types & Meanings
          </h2>
          <Button type="button" onClick={addType} variant="secondary" size="sm">
            Add Type
          </Button>
        </div>
        <div className="space-y-4">
          {formData.types.map((type, typeIndex) => (
            <div key={typeIndex} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Select
                  value={type.type}
                  onChange={(e) => {
                    const newTypes = [...formData.types];
                    newTypes[typeIndex].type = e.target.value;
                    setFormData({ ...formData, types: newTypes });
                  }}
                  options={[
                    { value: 'noun', label: 'Noun' },
                    { value: 'verb', label: 'Verb' },
                    { value: 'adjective', label: 'Adjective' },
                    { value: 'adverb', label: 'Adverb' },
                  ]}
                  className="flex-1"
                />
                {formData.types.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeType(typeIndex)}
                    variant="danger"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
              {type.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="flex gap-2">
                  <Input
                    value={meaning}
                    onChange={(e) => {
                      const newTypes = [...formData.types];
                      newTypes[typeIndex].meanings[meaningIndex] = e.target.value;
                      setFormData({ ...formData, types: newTypes });
                    }}
                    placeholder="Meaning..."
                    className="flex-1"
                  />
                  {type.meanings.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMeaning(typeIndex, meaningIndex)}
                      variant="secondary"
                      size="sm"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addMeaning(typeIndex)}
                variant="ghost"
                size="sm"
              >
                + Add Meaning
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Examples */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Examples
          </h2>
          <Button type="button" onClick={addExample} variant="secondary" size="sm">
            Add Example
          </Button>
        </div>
        <div className="space-y-3">
          {formData.examples.map((example, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={example}
                onChange={(e) => {
                  const newExamples = [...formData.examples];
                  newExamples[index] = e.target.value;
                  setFormData({ ...formData, examples: newExamples });
                }}
                placeholder="Example sentence..."
                className="flex-1"
                rows={2}
              />
              {formData.examples.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeExample(index)}
                  variant="secondary"
                  size="sm"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Metadata */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Metadata
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
            required
          />
          <Input
            label="IELTS Band"
            type="number"
            step="0.5"
            min="4"
            max="9"
            value={formData.band}
            onChange={(e) => setFormData({ ...formData, band: parseFloat(e.target.value) })}
            required
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create' : 'Update'} Vocabulary
        </Button>
        <Button
          type="button"
          onClick={() => window.location.href = '/admin/vocabulary'}
          variant="secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
