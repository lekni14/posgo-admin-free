"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: false, // ปิด retry หมดเลย
          },
          mutations: {
            retry: false, // ปิด retry หมดเลย
          },
        },
      })
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider
        attribute="data-theme"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        enableColorScheme={false}
        storageKey="theme"
        // Remove forcedTheme when you want theme switching
        forcedTheme={mounted ? undefined : "light"}
      > */}
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
