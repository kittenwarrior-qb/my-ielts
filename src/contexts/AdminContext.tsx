import { createContext, useContext, type ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType>({ isAdmin: false });

export function AdminProvider({ 
  children, 
  isAdmin 
}: { 
  children: ReactNode; 
  isAdmin: boolean;
}) {
  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
