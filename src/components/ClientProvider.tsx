'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient(); // ✅ Safe to initialize here (client-side)
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}