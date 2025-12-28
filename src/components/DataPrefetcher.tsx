import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchAllData } from '../hooks/useData';
import LoadingBar from './LoadingBar';

export default function DataPrefetcher() {
  const queryClient = useQueryClient();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    // Only prefetch once per session
    if (!hasPrefetched.current) {
      prefetchAllData(queryClient);
      hasPrefetched.current = true;
    }
  }, [queryClient]);

  return <LoadingBar />;
}
