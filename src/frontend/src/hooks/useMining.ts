import { createActor } from "@/backend";
import type { GameState } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGameStateQueryKey } from "./useGameState";

interface MiningActor {
  collectCoins: () => Promise<GameState>;
}

export function useMining() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const queryKey = useGameStateQueryKey();

  const mutation = useMutation<GameState, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as MiningActor).collectCoins();
    },
    onSuccess: (newState) => {
      queryClient.setQueryData<GameState>(queryKey, newState);
    },
  });

  return {
    mine: mutation.mutate,
    isMining: mutation.isPending,
    lastResult: mutation.data,
    error: mutation.error,
  };
}
