import type { UseMutationResult } from "@tanstack/react-query";

type EnhancedMutation<TResult> = UseMutationResult<TResult> &
  (() => Promise<TResult>);

export type { EnhancedMutation };
