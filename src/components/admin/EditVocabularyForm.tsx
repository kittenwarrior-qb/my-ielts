import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import ErrorDialog from '../dashboard/ErrorDialog';
import type { Vocabulary } from '@/lib/db/schema';

interface EditVocabularyFormProps {
  vocabulary: Vocabulary;
  onSuccess: () => void;
  onCancel: () => void;
}

type InputMethod = 'manual' | 'api' | 'json';

const VOCABULARY_JSON_TEMPLATE = `{
  "word": "example",
  "phonetic": "/ɪɡˈzɑːmpl/",
  "audioUrl": "",
  "types": [
    {
      "type": "noun",
      "meanings": ["A thing characteristic of its kind"]
    }
  ],
  "examples": [
    "This is an example sentence."
  ],
  "synonyms": ["instance", "sample"],
  "wordForms": ["examples", "exemplary"],
  "topics": ["General"],
  "level": "intermediate",
  "band": 6.0,
  "grammar": "Countable noun"
}`;

export default function EditVocabularyForm({ vocabulary, onSuccess, onCancel }: EditVocabularyFormProps) {
  const [method, setMethod] = useState<InputMethod>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  // API fetch state
  const [fetchWord, setFetchWord] = useState(vocabulary.word || '');
  const [fetching, setFetching] = useState(false);

  // JSON import state
  const [jsonInput, setJsonInput] = useState(JSON.stringify({
    word: vocabulary.word,
    phonetic: vocabulary.phonetic,
    audioUrl: vocabulary.audioUrl,
    types: vocabulary.types,
    examples: vocabulary.examples,
    synonyms: vocabulary.synonyms,
    wordForms: vocabulary.wordForms,
    topics: vocabulary.topics,
    level: vocabulary.level,
    band: vocabulary.band,
    grammar: vocabulary.grammar,
  }, null, 2));

  // Manual form state - initialize with vocabulary data
  const [formData, setFormData] = useState({
    word: vocabulary.word || '',
    phonetic: vocabulary.phonetic || '',
    audioUrl: vocabulary.audioUrl || '',
    level: (vocabulary.level || 'intermediate') as 'beginner' | 'intermediate' | 'advanced',
    band: vocabulary.band || 6.0,
    grammar: vocabulary.grammar || '',
    types: (vocabulary.types as any) || [{ type: 'noun', meanings: [''] }],
    examples: (vocabulary.examples as string[]) || [''],
    synonyms: (vocabulary.synonyms as string[]) || [''],
    wordForms: (vocabulary.wordForms as string[]) || [''],
    topics: (vocabulary.topics as string[]) || ['General'],
  });

  const handleFetchFromAPI = async () => {
    if (!fetchWord.trim()) {
      setError('Vui lòng nhập từ cần tra');
      return;
    }

    setFetching(true);
    setError('');

    try {
      const response = await fetch('/api/vocabulary/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: fetchWord.trim() }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch word');
      }

      // Populate form with fetched data
      setFormData({
        word: result.data.word || '',
        phonetic: result.data.phonetic || '',
        audioUrl: result.data.audioUrl || '',
        level: result.data.level || 'intermediate',
        band: result.data.band || 6.0,
        grammar: result.data.grammar || '',
        types: result.data.types || [{ type: 'noun', meanings: [''] }],
        examples: result.data.examples || [''],
        synonyms: result.data.synonyms || [''],
        wordForms: result.data.wordForms || [''],
        topics: result.data.topics || ['General'],
      });

      setSuccess('Đã tải dữ liệu từ từ điển thành công!');
      setMethod('manual'); // Switch to manual to edit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải từ từ điển');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let payload;
      if (method === 'json') {
        payload = { method: 'json', json: jsonInput };
      } else {
        payload = { method: 'manual', data: formData };
      }

      const response = await fetch(`/api/vocabulary/${vocabulary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401 || response.status === 403) {
          setErrorDialogMessage('Bạn không có quyền chỉnh sửa vocabulary');
          setShowErrorDialog(true);
          return;
        }
        throw new Error(result.error || 'Failed to update vocabulary');
      }

      setSuccess('Cập nhật vocabulary thành công!');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'examples' | 'synonyms' | 'wordForms' | 'topics') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const updateArrayItem = (field: 'examples' | 'synonyms' | 'wordForms' | 'topics', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const removeArrayItem = (field: 'examples' | 'synonyms' | 'wordForms' | 'topics', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addType = () => {
    setFormData(prev => ({
      ...prev,
      types: [...prev.types, { type: 'noun', meanings: [''] }],
    }));
  };

  const updateType = (index: number, field: 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.map((t: any, i: number) => i === index ? { ...t, [field]: value } : t),
    }));
  };

  const addMeaning = (typeIndex: number) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.map((t: any, i: number) => 
        i === typeIndex ? { ...t, meanings: [...t.meanings, ''] } : t
      ),
    }));
  };

  const updateMeaning = (typeIndex: number, meaningIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.map((t: any, i: number) => 
        i === typeIndex 
          ? { ...t, meanings: t.meanings.map((m: string, mi: number) => mi === meaningIndex ? value : m) }
          : t
      ),
    }));
  };

  const removeMeaning = (typeIndex: number, meaningIndex: number) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.map((t: any, i: number) => 
        i === typeIndex 
          ? { ...t, meanings: t.meanings.filter((_: string, mi: number) => mi !== meaningIndex) }
          : t
      ),
    }));
  };

  const removeType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.filter((_: any, i: number) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Chỉnh sửa Vocabulary: {vocabulary.word}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Method Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() => setMethod('manual')}
              className={`px-6 py-3 font-medium ${
                method === 'manual'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chỉnh sửa thủ công
            </button>
            <button
              type="button"
              onClick={() => setMethod('api')}
              className={`px-6 py-3 font-medium ${
                method === 'api'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tra từ điển
            </button>
            <button
              type="button"
              onClick={() => setMethod('json')}
              className={`px-6 py-3 font-medium ${
                method === 'json'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chỉnh sửa JSON
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* API Fetch Tab */}
          {method === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập từ cần tra
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fetchWord}
                    onChange={(e) => setFetchWord(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Ví dụ: example"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFromAPI}
                    disabled={fetching}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {fetching && <Loader2 className="w-4 h-4 animate-spin" />}
                    Tra từ
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Dữ liệu sẽ được tải từ Free Dictionary API và bạn có thể chỉnh sửa trước khi lưu
                </p>
              </div>
            </div>
          )}

          {/* JSON Import Tab */}
          {method === 'json' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JSON Data
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Paste JSON here..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Chỉnh sửa JSON và submit để cập nhật
                </p>
              </div>
            </div>
          )}

          {/* Manual Entry Tab */}
          {method === 'manual' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word *
                </label>
                <input
                  type="text"
                  value={formData.word}
                  onChange={(e) => updateFormField('word', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phonetic *
                </label>
                <input
                  type="text"
                  value={formData.phonetic}
                  onChange={(e) => updateFormField('phonetic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="/ɪɡˈzɑːmpl/"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => updateFormField('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IELTS Band *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="9"
                  value={formData.band}
                  onChange={(e) => updateFormField('band', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio URL
                </label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => updateFormField('audioUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grammar
              </label>
              <input
                type="text"
                value={formData.grammar}
                onChange={(e) => updateFormField('grammar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Countable noun"
              />
            </div>

            {/* Types and Meanings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Types & Meanings *
              </label>
              {formData.types.map((type: any, typeIndex: number) => (
                <div key={typeIndex} className="mb-4 p-4 border border-gray-200 rounded">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={type.type}
                      onChange={(e) => updateType(typeIndex, 'type', e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="noun, verb, etc."
                    />
                    {formData.types.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeType(typeIndex)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Meanings</label>
                    {type.meanings.map((meaning: string, meaningIndex: number) => (
                      <div key={meaningIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={meaning}
                          onChange={(e) => updateMeaning(typeIndex, meaningIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Meaning..."
                        />
                        {type.meanings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMeaning(typeIndex, meaningIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addMeaning(typeIndex)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Add Meaning
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addType}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Type
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examples
              </label>
              {formData.examples.map((example, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => updateArrayItem('examples', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Example sentence..."
                  />
                  {formData.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('examples', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('examples')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Example
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Synonyms
              </label>
              {formData.synonyms.map((synonym, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={synonym}
                    onChange={(e) => updateArrayItem('synonyms', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Synonym..."
                  />
                  {formData.synonyms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('synonyms', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('synonyms')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Synonym
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Forms
              </label>
              {formData.wordForms.map((form, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form}
                    onChange={(e) => updateArrayItem('wordForms', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Word form..."
                  />
                  {formData.wordForms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('wordForms', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('wordForms')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Word Form
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics
              </label>
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateArrayItem('topics', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Topic..."
                  />
                  {formData.topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('topics', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('topics')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Topic
              </button>
            </div>
          </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold transition-all duration-150 active:translate-y-[4px]"
              style={{ boxShadow: '0 4px 0 0 #9ca3af', backgroundColor: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              onMouseDown={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 #9ca3af'}
              onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 4px 0 0 #9ca3af'}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-white rounded-lg font-bold disabled:bg-gray-400 flex items-center gap-2 transition-all duration-150 active:translate-y-[4px]"
              style={{ backgroundColor: '#FF6B6B', boxShadow: '0 4px 0 0 #CC3333' }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FA5252')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FF6B6B')}
              onMouseDown={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333')}
              onMouseUp={(e) => !loading && (e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333')}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Cập nhật Vocabulary
            </button>
          </div>
        </form>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showErrorDialog}
        title="Không có quyền"
        message={errorDialogMessage}
        onClose={() => {
          setShowErrorDialog(false);
          onCancel();
        }}
      />
    </div>
  );
}
