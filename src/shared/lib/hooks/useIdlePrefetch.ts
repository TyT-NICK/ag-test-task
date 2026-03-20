import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

type PrefetchOptions = {
  queryKey: QueryKey;
  queryFn: () => Promise<unknown>;
};

export function useIdlePrefetch<T>(
  items: T[] | undefined,
  getPrefetchOptions: (item: T) => PrefetchOptions,
): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!items?.length) return;

    let i = 0;
    let handle: ReturnType<typeof requestIdleCallback>;

    function step() {
      if (i >= items!.length) return;
      const options = getPrefetchOptions(items![i++]);
      queryClient.prefetchQuery(options);
      handle = requestIdleCallback(step);
    }

    handle = requestIdleCallback(step);
    return () => cancelIdleCallback(handle);
  }, [items, queryClient, getPrefetchOptions]);
}
