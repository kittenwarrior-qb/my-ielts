import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AddExpressionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type InputMethod = 'manual' | 'json';

const EXPRESSION_JSON_TEMPLATE = `{
  "expression": "Break the ice",
  "type": "idiom",
  "meaning": "To make people feel more comfortable in a social situation",
  "examples": [
    "He told a joke to break the ice."
  ],
  "grammar": "Used as a verb phrase",
  "relatedWords": ["introduce", "initiate"],
  "topics": ["Social Situations"],
  "category": "speaking",
  "synonyms": ["start a conversation"],
  "context": {
    "register": "neutral",
    "mode": "both",
    "frequency": "common"
  },
  "externalLinks": []
}`;

export default function AddExpressionForm({ onSuccess, onCancel }: AddExpressionFormProps) {
  const [method, setMethod] = useState<InputMethod>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // JSON import state
  const [jsonInput, setJsonInput] = useState(EXPRESSION_JSON_TEMPLATE);

  // Manual form state
  const [formData, setFormData] = useState({
    expression: '',
    type: 'idiom' as 'idiom' | 'phrase',
    meaning: '',
    grammar: '',
    category: 'speaking',
    examples: [''],
    relatedWords: [''],
    topics: ['IELTS Speaking'],
    synonyms: [''],
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

      const response = await fetch('/api/expressions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create expression');
      }

      setSuccess('Tạo expression thành công!');
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

  const addArrayItem = (field: 'examples' | 'relatedWords' | 'topics' | 'synonyms') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const updateArrayItem = (field: 'examples' | 'relatedWords' | 'topics' | 'synonyms', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const removeArrayItem = (field: 'examples' | 'relatedWords' | 'topics' | 'synonyms', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Thêm Expression Mới</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expression *
                  </label>
                  <input
                    type="text"
                    value={formData.expression}
                    onChange={(e) => updateFormField('expression', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Break the ice"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormField('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="idiom">Idiom</option>
                    <option value="phrase">Phrase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meaning *
                </label>
                <textarea
                  value={formData.meaning}
                  onChange={(e) => updateFormField('meaning', e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Explain the meaning..."
                  required
                />
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
                  placeholder="Used as a verb phrase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="speaking">Speaking</option>
                  <option value="writing">Writing</option>
                  <option value="general">General</option>
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
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Tạo Expression
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
