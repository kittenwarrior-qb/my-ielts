import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import ErrorDialog from '../dashboard/ErrorDialog';

interface AddGrammarFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type InputMethod = 'manual' | 'json';

const GRAMMAR_JSON_TEMPLATE = `{
  "title": "Present Perfect",
  "structure": "have/has + past participle",
  "explanation": "Used for actions that started in the past and continue to the present",
  "examples": [
    "I have lived here for 5 years.",
    "She has finished her homework."
  ],
  "usage": "Use for experiences, changes, and continuing situations",
  "notes": "Often used with 'for', 'since', 'already', 'yet'",
  "topics": ["Tenses", "IELTS Grammar"],
  "level": "intermediate",
  "externalLinks": []
}`;

export default function AddGrammarForm({ onSuccess, onCancel }: AddGrammarFormProps) {
  const [method, setMethod] = useState<InputMethod>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  // JSON import state
  const [jsonInput, setJsonInput] = useState(GRAMMAR_JSON_TEMPLATE);

  // Manual form state
  const [formData, setFormData] = useState({
    title: '',
    structure: '',
    explanation: '',
    usage: '',
    notes: '',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    examples: [''],
    topics: ['IELTS Grammar'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = method === 'json' 
        ? { method: 'json', json: jsonInput }
        : { method: 'manual', data: formData };

      const response = await fetch('/api/grammar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Check if it's a permission error
        if (response.status === 401 || response.status === 403) {
          setErrorDialogMessage('Bạn cần đăng nhập với tài khoản admin để thực hiện thao tác này');
          setShowErrorDialog(true);
          return;
        }
        throw new Error(result.error || 'Failed to create grammar');
      }

      setSuccess('Tạo grammar thành công!');
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

  const addArrayItem = (field: 'examples' | 'topics') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const updateArrayItem = (field: 'examples' | 'topics', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const removeArrayItem = (field: 'examples' | 'topics', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Thêm Grammar Mới</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Present Perfect"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Structure *
                </label>
                <input
                  type="text"
                  value={formData.structure}
                  onChange={(e) => updateFormField('structure', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="have/has + past participle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation *
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => updateFormField('explanation', e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Explain when and how to use this grammar..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage
                </label>
                <textarea
                  value={formData.usage}
                  onChange={(e) => updateFormField('usage', e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="When to use this grammar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Additional notes..."
                />
              </div>

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
                  Examples *
                </label>
                {formData.examples.map((example, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => updateArrayItem('examples', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Example sentence..."
                      required
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
              Tạo Grammar
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
