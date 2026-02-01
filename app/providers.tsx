'use client';

import { AuthProvider } from '@/src/contexts/AuthContext';
import { AppProvider } from '@/src/contexts/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
