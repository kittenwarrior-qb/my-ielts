import { QueryClient } from '@tanstack/react-query';

// Create a singleton QueryClient that persists across page navigations
let globalQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!globalQueryClient) {
    globalQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 15, // 15 minutes - data stays fresh longer
          gcTime: 1000 * 60 * 60, // 60 minutes - keep in memory longer
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          retry: 1,
        },
      },
    });
  }
  return globalQueryClient;
}

export const queryClient = getQueryClient();
