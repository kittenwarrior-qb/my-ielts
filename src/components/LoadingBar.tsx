import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';

export default function LoadingBar() {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isFetching > 0) {
      setShow(true);
    } else {
      // Delay hiding to show completion
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div 
        className="h-full bg-red-600 transition-all duration-300"
        style={{ 
          width: isFetching > 0 ? '70%' : '100%',
          transition: isFetching > 0 ? 'width 2s ease-out' : 'width 0.3s ease-in'
        }}
      />
    </div>
  );
}
