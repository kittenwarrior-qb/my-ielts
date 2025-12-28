import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Expression } from '@/lib/db/schema';

interface ExpressionsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  item?: Expression | null;
}

export default function ExpressionsFormModal({
  isOpen,
  onClose,
  onSave,
  item,
}: ExpressionsFormModalProps) {
  const [formData, setFormData] = useState({
    expression: '',
    type: 'idiom' as 'idiom' | 'phrase',
    meaning: '',
    grammar: '',
    examples: '',
    relatedWords: '',
    topics: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      const examples = item.examples as string[];
      const relatedWords = item.relatedWords as string[];
      const topics = item.topics as string[];

      setFormData({
        expression: item.expression,
        type: item.type,
        meaning: item.meaning,
        grammar: item.grammar || '',
        examples: examples.join('\n'),
        relatedWords: relatedWords.join(', '),
        topics: topics.join(', '),
        category: item.category || '',
      });
    } else {
      setFormData({
        expression: '',
        type: 'idiom',
        meaning: '',
        grammar: '',
        examples: '',
        relatedWords: '',
        topics: '',
        category: '',
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        expression: formData.expression,
        type: formData.type,
        meaning: formData.meaning,
        grammar: formData.grammar || null,
        examples: formData.examples.split('\n').filter(e => e.trim()),
        relatedWords: formData.relatedWords.split(',').map(w => w.trim()).filter(w => w),
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t),
        category: formData.category || null,
      };

      await onSave(data);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Chỉnh sửa' : 'Thêm mới'} {formData.type === 'idiom' ? 'thành ngữ' : 'cụm từ'}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin vào form bên dưới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">
              Loại <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'idiom' | 'phrase') => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idiom">Thành ngữ (Idiom)</SelectItem>
                <SelectItem value="phrase">Cụm từ (Phrase)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expression">
              {formData.type === 'idiom' ? 'Thành ngữ' : 'Cụm từ'} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="expression"
              value={formData.expression}
              onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning">
              Nghĩa <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="meaning"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grammar">Grammar (English)</Label>
            <Input
              id="grammar"
              value={formData.grammar}
              onChange={(e) => setFormData({ ...formData, grammar: e.target.value })}
              placeholder="e.g., used with present perfect, followed by to-infinitive"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examples">Ví dụ</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              rows={3}
              placeholder="Mỗi ví dụ một dòng"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedWords">Từ liên quan</Label>
            <Input
              id="relatedWords"
              value={formData.relatedWords}
              onChange={(e) => setFormData({ ...formData, relatedWords: e.target.value })}
              placeholder="word1, word2, word3 (phân cách bằng dấu phẩy)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Chủ đề</Label>
            <Input
              id="topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="education, technology, health (phân cách bằng dấu phẩy)"
            />
          </div>

          {formData.type === 'phrase' && (
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
