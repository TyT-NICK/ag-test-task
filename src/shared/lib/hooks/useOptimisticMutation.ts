import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryFilters, UseMutationOptions } from "@tanstack/react-query";

type CacheUpdate<TVariables> = {
  filters: QueryFilters;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updater: (old: any, variables: TVariables) => unknown;
};

export function useOptimisticMutation<TData, TError, TVariables>({
  mutationFn,
  cacheUpdates,
  onMutate,
  onSuccess,
  onError,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  cacheUpdates: CacheUpdate<TVariables>[];
} & Pick<
  UseMutationOptions<TData, TError, TVariables>,
  "onSuccess" | "onError"
> & {
    onMutate?: VoidFunction;
  }) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onMutate: (variables) => {
      for (const { filters, updater } of cacheUpdates) {
        for (const [queryKey, old] of queryClient.getQueriesData(filters)) {
          queryClient.setQueryData(queryKey, updater(old, variables));
        }
      }
      onMutate?.();
    },
    onError: (error, variables, onMutateResult, context) => {
      for (const { filters } of cacheUpdates) {
        queryClient.invalidateQueries(filters);
      }
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess,
  });
}
