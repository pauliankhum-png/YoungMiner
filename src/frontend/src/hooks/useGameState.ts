import { createActor } from "@/backend";
import type { GameState } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const GAME_STATE_KEY = ["gameState"];

function defaultGameState(): GameState {
  return {
    coinBalance: 0n,
    coinsPerSecond: 0n,
    totalClicks: 0n,
    cpuCount: 0n,
    gpuCount: 0n,
    coolingCount: 0n,
    lastSaveTimestamp: 0n,
  };
}

export function useGameState() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<GameState>({
    queryKey: GAME_STATE_KEY,
    queryFn: async () => {
      if (!actor) return defaultGameState();
      try {
        const state = await (
          actor as unknown as { getGameState: () => Promise<GameState> }
        ).getGameState();
        return state;
      } catch {
        return defaultGameState();
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2000,
    refetchInterval: 5000,
  });
}

export function useGameStateQueryKey() {
  return GAME_STATE_KEY;
}

export function useInvalidateGameState() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: GAME_STATE_KEY });
}
