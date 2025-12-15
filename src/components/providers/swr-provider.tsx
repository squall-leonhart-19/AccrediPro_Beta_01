"use client";

import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        shouldRetryOnError: false,
        dedupingInterval: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
