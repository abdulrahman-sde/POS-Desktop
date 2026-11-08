import { QueryClient } from '@tanstack/react-query'

// The shop data only changes through this app, so it never goes stale by itself: it refreshes
// when a write hook says "this changed" (invalidateQueries). No retries: a refused save would
// be refused again, and the backend is on the same computer.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false }
  }
})
