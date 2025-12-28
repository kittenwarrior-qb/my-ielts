import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import ErrorDialog from '../dashboard/ErrorDialog';

interface AddVocabularyFormProps {
  boardId?: string; // Optional: if provided, add vocabulary to this board
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

export default function AddVocabularyForm({ boardId, onSuccess, onCancel }: AddVocabularyFormProps) {
  const [method, setMethod] = useState<InputMethod>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  // API fetch state
  const [fetchWord, setFetchWord] = useState('');
  const [fetching, setFetching] = useState(false);

  // JSON import state
  const [jsonInput, setJsonInput] = useState(VOCABULARY_JSON_TEMPLATE);

  // Manual form state
  const [formData, setFormData] = useState({
    word: '',
    phonetic: '',
    audioUrl: '',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    band: 6.0,
    grammar: '',
    types: [{ type: 'noun', meanings: [''] }],
    examples: [''],
    synonyms: [''],
    wordForms: [''],
    topics: ['General'],
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
      const payload = method === 'json' 
        ? { method: 'json', json: jsonInput }
        : { method: 'manual', data: formData };

      const response = await fetch('/api/vocabulary/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response result:', result);

      if (!response.ok || !result.success) {
        // Check if it's a permission error
        if (response.status === 401 || response.status === 403) {
          setErrorDialogMessage('Bạn cần đăng nhập với tài khoản admin để thực hiện thao tác này');
          setShowErrorDialog(true);
          return;
        }
        throw new Error(result.error || 'Failed to create vocabulary');
      }

      // If boardId is provided, add the vocabulary to the board
      if (boardId && result.data?.id) {
        try {
          const addToBoardResponse = await fetch(`/api/boards/${boardId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: result.data.id }),
          });

          if (!addToBoardResponse.ok) {
            console.error('Failed to add vocabulary to board');
          }
        } catch (boardError) {
          console.error('Error adding vocabulary to board:', boardError);
        }
      }

      setSuccess('Tạo vocabulary thành công!');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Thêm Vocabulary Mới</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Method Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setMethod('manual')}
              className={`px-6 py-3 font-medium ${
                method === 'manual'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Nhập thủ công
            </button>
            <button
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
              onClick={() => setMethod('json')}
              className={`px-6 py-3 font-medium ${
                method === 'json'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Import JSON
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
                  Chỉnh sửa JSON template ở trên và submit
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
              Tạo Vocabulary
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
          onCancel(); // Close the form when error dialog is closed
        }}
      />
    </div>
  );
}
