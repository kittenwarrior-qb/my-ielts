import { X, ExternalLink, BookOpen, Lightbulb, AlertCircle, Youtube } from 'lucide-react';
import type { Grammar } from '@/lib/db/schema';

interface GrammarDetailModalProps {
  item: Grammar;
  isOpen: boolean;
  onClose: () => void;
}

interface ExternalLink {
  type: 'youtube' | 'website' | 'blog' | 'course';
  url: string;
  title: string;
  thumbnail?: string;
}

export default function GrammarDetailModal({
  item,
  isOpen,
  onClose,
}: GrammarDetailModalProps) {
  if (!isOpen) return null;

  const examples = item.examples as string[];
  const topics = item.topics as string[];
  const externalLinks = (item.externalLinks as ExternalLink[]) || [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-black">{item.title}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded ${getLevelColor(item.level)}`}>
                {item.level}
              </span>
            </div>
            {topics && topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Structure */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Cấu trúc</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-base text-gray-900 font-mono whitespace-pre-wrap">
                {item.structure}
              </code>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Giải thích</h3>
            </div>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {item.explanation}
            </p>
          </div>

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ví dụ</h3>
              <ul className="space-y-3">
                {examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <p className="text-gray-900 flex-1 pt-0.5">
                      {example}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage */}
          {item.usage && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ngữ cảnh sử dụng</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {item.usage}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Lưu ý quan trọng</h3>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {item.notes}
                </p>
              </div>
            </div>
          )}

          {/* External Resources */}
          {externalLinks && externalLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Nguồn học tập thêm</h3>
              <div className="grid grid-cols-1 gap-3">
                {externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {link.thumbnail && link.type === 'youtube' ? (
                      <img 
                        src={link.thumbnail} 
                        alt={link.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {getLinkIcon(link.type)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{link.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {topics && topics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Chủ đề liên quan</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
