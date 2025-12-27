import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'vocabulary' | 'idioms' | 'phrases';
  onAdd: () => void;
}

const emptyStates = {
  vocabulary: {
    icon: '📚',
    title: 'Chưa có từ vựng nào',
    description: 'Bắt đầu xây dựng bộ từ vựng của bạn ngay hôm nay',
  },
  idioms: {
    icon: '💬',
    title: 'Chưa có idiom nào',
    description: 'Thêm idioms để cải thiện kỹ năng Speaking & Writing',
  },
  phrases: {
    icon: '📝',
    title: 'Chưa có phrase nào',
    description: 'Thêm phrases hữu ích cho IELTS của bạn',
  },
};

export default function EmptyState({ type, onAdd }: EmptyStateProps) {
  const state = emptyStates[type];

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">{state.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{state.title}</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          {state.description}
        </p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm {type === 'vocabulary' ? 'từ vựng' : type === 'idioms' ? 'idiom' : 'phrase'} đầu tiên
        </Button>
      </CardContent>
    </Card>
  );
}
