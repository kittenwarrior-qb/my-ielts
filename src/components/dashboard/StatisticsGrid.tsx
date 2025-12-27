import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageSquare, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatisticsProps {
  stats: {
    vocabulary: number;
    grammar: number;
    expressions: number;
  };
}

export default function StatisticsGrid({ stats }: StatisticsProps) {
  const statCards = [
    {
      title: 'Vocabulary',
      value: stats.vocabulary,
      icon: BookOpen,
      color: 'text-ielts-500',
      bgColor: 'bg-ielts-50 dark:bg-ielts-900/20',
      href: '/dashboard/vocabulary',
    },
    {
      title: 'Grammar',
      value: stats.grammar,
      icon: BookMarked,
      color: 'text-success-500',
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      href: '/dashboard/grammar',
    },
    {
      title: 'Expression',
      subtitle: 'Idioms & Phrases',
      value: stats.expressions,
      icon: MessageSquare,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      href: '/dashboard/expressions',
    },
  ];

  const handleNavigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
          onClick={() => handleNavigate(stat.href)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={cn('p-2 rounded-lg', stat.bgColor)}>
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
