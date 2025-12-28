import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Board } from '@/lib/db/schema';
import type { Vocabulary } from '@/lib/db/schema';
import type { Expression } from '@/lib/db/schema';
import type { Grammar } from '@/lib/db/schema';

// Query Keys
export const QUERY_KEYS = {
  boards: (type?: string) => ['boards', type] as const,
  vocabulary: ['vocabulary'] as const,
  expressions: ['expressions'] as const,
  grammar: ['grammar'] as const,
  grammarByIds: (ids: string[]) => ['grammar', 'by-ids', ids] as const,
  grammarItem: (id: string) => ['grammar', id] as const,
  expressionsByIds: (ids: string[]) => ['expressions', 'by-ids', ids] as const,
  expressionItem: (id: string) => ['expressions', id] as const,
  boardDetail: (id: string) => ['board', id] as const,
};

// Fetch functions
async function fetchBoards(type?: string): Promise<Board[]> {
  const url = type ? `/api/boards?type=${type}` : '/api/boards';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch boards');
  return response.json();
}

async function fetchVocabulary(): Promise<Vocabulary[]> {
  const response = await fetch('/api/vocabulary');
  if (!response.ok) throw new Error('Failed to fetch vocabulary');
  return response.json();
}

async function fetchExpressions(): Promise<Expression[]> {
  const response = await fetch('/api/expressions');
  if (!response.ok) throw new Error('Failed to fetch expressions');
  return response.json();
}

async function fetchGrammar(): Promise<Grammar[]> {
  const response = await fetch('/api/grammar');
  if (!response.ok) throw new Error('Failed to fetch grammar');
  return response.json();
}

async function fetchGrammarByIds(ids: string[]): Promise<Grammar[]> {
  const response = await fetch(`/api/grammar/by-ids?ids=${ids.join(',')}`);
  if (!response.ok) throw new Error('Failed to fetch grammar items');
  return response.json();
}

async function fetchGrammarItem(id: string): Promise<Grammar> {
  const response = await fetch(`/api/grammar/${id}`);
  if (!response.ok) throw new Error('Failed to fetch grammar item');
  return response.json();
}

async function fetchExpressionsByIds(ids: string[]): Promise<Expression[]> {
  const response = await fetch(`/api/expressions/by-ids?ids=${ids.join(',')}`);
  if (!response.ok) throw new Error('Failed to fetch expressions');
  return response.json();
}

async function fetchExpressionItem(id: string): Promise<Expression> {
  const response = await fetch(`/api/expressions/${id}`);
  if (!response.ok) throw new Error('Failed to fetch expression');
  return response.json();
}

async function createBoard(data: { name: string; description?: string; type: string }): Promise<Board> {
  const response = await fetch('/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create board');
  return response.json();
}

// Hooks
export function useBoards(type?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.boards(type),
    queryFn: () => fetchBoards(type),
  });
}

export function useVocabulary() {
  return useQuery({
    queryKey: QUERY_KEYS.vocabulary,
    queryFn: fetchVocabulary,
  });
}

export function useExpressions() {
  return useQuery({
    queryKey: QUERY_KEYS.expressions,
    queryFn: fetchExpressions,
  });
}

export function useGrammar() {
  return useQuery({
    queryKey: QUERY_KEYS.grammar,
    queryFn: fetchGrammar,
  });
}

export function useGrammarByIds(ids: string[]) {
  return useQuery({
    queryKey: QUERY_KEYS.grammarByIds(ids),
    queryFn: () => fetchGrammarByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useGrammarItem(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.grammarItem(id),
    queryFn: () => fetchGrammarItem(id),
  });
}

export function useExpressionsByIds(ids: string[]) {
  return useQuery({
    queryKey: QUERY_KEYS.expressionsByIds(ids),
    queryFn: () => fetchExpressionsByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useExpressionItem(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.expressionItem(id),
    queryFn: () => fetchExpressionItem(id),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Invalidate all board queries to refetch
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

// Prefetch function for initial load
let isPrefetching = false;
let hasPrefetched = false;

export async function prefetchAllData(queryClient: any) {
  // Prevent multiple simultaneous prefetch calls
  if (isPrefetching || hasPrefetched) {
    return;
  }

  isPrefetching = true;

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.boards(),
        queryFn: () => fetchBoards(),
      }),
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.vocabulary,
        queryFn: fetchVocabulary,
      }),
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.expressions,
        queryFn: fetchExpressions,
      }),
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.grammar,
        queryFn: fetchGrammar,
      }),
    ]);
    
    hasPrefetched = true;
  } finally {
    isPrefetching = false;
  }
}
