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
import type { Vocabulary } from '@/lib/db/schema';

interface VocabularyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  item?: Vocabulary | null;
}

export default function VocabularyFormModal({
  isOpen,
  onClose,
  onSave,
  item,
}: VocabularyFormModalProps) {
  const [formData, setFormData] = useState({
    word: '',
    phonetic: '',
    meaning: '',
    grammar: '',
    examples: '',
    topics: '',
    level: 'intermediate',
    band: 6.0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      const types = item.types as any;
      const firstMeaning = Array.isArray(types) && types[0]?.meanings?.[0];
      const examples = item.examples as string[];
      const topics = item.topics as string[];

      setFormData({
        word: item.word,
        phonetic: item.phonetic,
        meaning: firstMeaning || '',
        grammar: item.grammar || '',
        examples: examples.join('\n'),
        topics: topics.join(', '),
        level: item.level,
        band: item.band,
      });
    } else {
      setFormData({
        word: '',
        phonetic: '',
        meaning: '',
        grammar: '',
        examples: '',
        topics: '',
        level: 'intermediate',
        band: 6.0,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        word: formData.word,
        phonetic: formData.phonetic,
        types: [
          {
            type: 'noun',
            meanings: [formData.meaning],
          },
        ],
        examples: formData.examples.split('\n').filter(e => e.trim()),
        synonyms: [],
        wordForms: [],
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t),
        level: formData.level,
        band: formData.band,
        grammar: formData.grammar || null,
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
            {item ? 'Chỉnh sửa' : 'Thêm mới'} từ vựng
          </DialogTitle>
          <DialogDescription>
            Điền thông tin vào form bên dưới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">
              Từ vựng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="word"
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phonetic">
              Phiên âm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phonetic"
              value={formData.phonetic}
              onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
              required
              placeholder="/ˈeksəmpl/"
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
              placeholder="e.g., countable noun, transitive verb, adjective + preposition"
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
            <Label htmlFor="topics">Chủ đề</Label>
            <Input
              id="topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="education, technology, health (phân cách bằng dấu phẩy)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Cấp độ</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="band">Band điểm</Label>
              <Input
                id="band"
                type="number"
                min="0"
                max="9"
                step="0.5"
                value={formData.band}
                onChange={(e) => setFormData({ ...formData, band: parseFloat(e.target.value) })}
              />
            </div>
          </div>

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
