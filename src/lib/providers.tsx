'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { FirebaseAuthProvider } from '@/components/providers/FirebaseAuthProvider'
import { ModalProvider } from '@/contexts/ModalContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ModalRenderer from '@/components/ModalRenderer'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 3,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthProvider>
        <ThemeProvider>
          <ModalProvider>
            {children}
            <ModalRenderer />
            <ReactQueryDevtools initialIsOpen={false} />
          </ModalProvider>
        </ThemeProvider>
      </FirebaseAuthProvider>
    </QueryClientProvider>
  )
}