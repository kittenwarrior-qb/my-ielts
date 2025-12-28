import { useState, useCallback } from 'react';
import type { ToastType } from '../components/ui/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string) => {
    showToast('success', message);
  }, [showToast]);

  const error = useCallback((message: string) => {
    showToast('error', message);
  }, [showToast]);

  const warning = useCallback((message: string) => {
    showToast('warning', message);
  }, [showToast]);

  const info = useCallback((message: string) => {
    showToast('info', message);
  }, [showToast]);

  return {
    toasts,
    hideToast,
    success,
    error,
    warning,
    info,
  };
}
