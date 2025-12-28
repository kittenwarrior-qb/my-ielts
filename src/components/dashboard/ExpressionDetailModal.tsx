import { X, ExternalLink, MessageSquare, BookOpen, Youtube, Tag } from 'lucide-react';
import type { Expression } from '@/lib/db/schema';

interface ExpressionDetailModalProps {
  item: Expression;
  isOpen: boolean;
  onClose: () => void;
}

interface ExternalLink {
  type: 'youtube' | 'website' | 'blog' | 'course';
  url: string;
  title: string;
  thumbnail?: string;
}

interface Context {
  register?: 'formal' | 'informal' | 'neutral';
  mode?: 'written' | 'spoken' | 'both';
  frequency?: 'common' | 'uncommon' | 'rare';
}

export default function ExpressionDetailModal({
  item,
  isOpen,
  onClose,
}: ExpressionDetailModalProps) {
  if (!isOpen) return null;

  const examples = item.examples as string[];
  const topics = item.topics as string[];
  const relatedWords = item.relatedWords as string[];
  const synonyms = (item.synonyms as string[]) || [];
  const externalLinks = (item.externalLinks as ExternalLink[]) || [];
  const context = (item.context as Context) || {};

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'idiom':
        return 'bg-purple-100 text-purple-800';
      case 'phrase':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContextBadgeColor = (type: string, value: string) => {
    if (type === 'register') {
      switch (value) {
        case 'formal':
          return 'bg-blue-100 text-blue-800';
        case 'informal':
          return 'bg-orange-100 text-orange-800';
        case 'neutral':
          return 'bg-gray-100 text-gray-800';
      }
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const highlightExpression = (text: string) => {
    const expression = item.expression;
    const regex = new RegExp(`(${expression})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, idx) => 
      regex.test(part) ? (
        <strong key={idx} className="font-semibold text-blue-700">{part}</strong>
      ) : (
        part
      )
    );
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
              <h2 className="text-3xl font-bold text-black">{item.expression}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
              {item.category && (
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                  {item.category}
                </span>
              )}
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
          {/* Meaning */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Nghĩa</h3>
            </div>
            <p className="text-lg text-gray-900 font-medium">
              {item.meaning}
            </p>
          </div>

          {/* Context */}
          {(context.register || context.mode || context.frequency) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ngữ cảnh sử dụng</h3>
              <div className="flex flex-wrap gap-2">
                {context.register && (
                  <span className={`px-3 py-1.5 text-sm font-medium rounded ${getContextBadgeColor('register', context.register)}`}>
                    {context.register === 'formal' ? 'Trang trọng' : context.register === 'informal' ? 'Thân mật' : 'Trung tính'}
                  </span>
                )}
                {context.mode && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded">
                    {context.mode === 'written' ? 'Văn viết' : context.mode === 'spoken' ? 'Văn nói' : 'Cả hai'}
                  </span>
                )}
                {context.frequency && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-medium rounded">
                    {context.frequency === 'common' ? 'Phổ biến' : context.frequency === 'uncommon' ? 'Ít gặp' : 'Hiếm'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ví dụ trong ngữ cảnh</h3>
              <ul className="space-y-3">
                {examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <p className="text-gray-900 flex-1 pt-0.5 italic">
                      "{highlightExpression(example)}"
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Synonyms */}
          {synonyms && synonyms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Từ đồng nghĩa & Thành ngữ tương tự</h3>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((synonym, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                  >
                    {synonym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Words */}
          {relatedWords && relatedWords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Từ vựng liên quan</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedWords.map((word, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Notes */}
          {item.grammar && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Ghi chú ngữ pháp</h3>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {item.grammar}
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
