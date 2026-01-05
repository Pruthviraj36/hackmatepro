'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 2, // 2 minutes
                        gcTime: 1000 * 60 * 60 * 24, // 24 hours
                        retry: 1,
                        refetchOnWindowFocus: false,
                        refetchOnMount: true, // Still refetch on mount but keep data stale for 10 mins
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
