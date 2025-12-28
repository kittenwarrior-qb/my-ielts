import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Zap, Target } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

interface ToolbarProps {
  title: string;
  itemCount: number;
  onAdd: () => void;
  onSpeedReview?: () => void;
  onQuiz?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterOption[];
}

export default function Toolbar({
  title,
  itemCount,
  onAdd,
  onSpeedReview,
  onQuiz,
  searchValue = '',
  onSearchChange,
  filters = [],
}: ToolbarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {itemCount} mục
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm
            </Button>
            {onSpeedReview && (
              <Button variant="outline" onClick={onSpeedReview}>
                <Zap className="mr-2 h-4 w-4" />
                Speed Review
              </Button>
            )}
            {onQuiz && (
              <Button variant="outline" onClick={onQuiz}>
                <Target className="mr-2 h-4 w-4" />
                Trắc nghiệm
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters.map((filter) => (
            <Select
              key={filter.label}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
