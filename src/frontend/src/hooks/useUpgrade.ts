import { createActor } from "@/backend";
import type { GameState, UpgradeKey, UpgradeResult } from "@/types/game";
import { makeUpgradeType } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGameStateQueryKey } from "./useGameState";

interface UpgradeActor {
  purchaseUpgrade: (
    upgradeType: ReturnType<typeof makeUpgradeType>,
  ) => Promise<UpgradeResult>;
  getUpgradeCost: (
    upgradeType: ReturnType<typeof makeUpgradeType>,
  ) => Promise<bigint>;
}

export function useUpgrade() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const queryKey = useGameStateQueryKey();

  const mutation = useMutation<UpgradeResult, Error, UpgradeKey>({
    mutationFn: async (key: UpgradeKey) => {
      if (!actor) throw new Error("Actor not ready");
      const upgradeType = makeUpgradeType(key);
      return (actor as unknown as UpgradeActor).purchaseUpgrade(upgradeType);
    },
    onSuccess: (result) => {
      if ("ok" in result) {
        queryClient.setQueryData<GameState>(queryKey, result.ok);
        toast.success("Upgrade purchased!", {
          description: "Your mining rig has been upgraded.",
          duration: 3000,
        });
      } else if ("insufficientFunds" in result) {
        const { required, available } = result.insufficientFunds;
        toast.error("Insufficient funds", {
          description: `Need ${Number(required).toLocaleString()} HC, have ${Number(available).toLocaleString()} HC.`,
          duration: 4000,
        });
      }
    },
    onError: () => {
      toast.error("Upgrade failed", {
        description: "Could not complete the upgrade. Try again.",
        duration: 4000,
      });
    },
  });

  const getUpgradeCost = async (key: UpgradeKey): Promise<bigint> => {
    if (!actor) return 0n;
    try {
      const upgradeType = makeUpgradeType(key);
      return (actor as unknown as UpgradeActor).getUpgradeCost(upgradeType);
    } catch {
      return 0n;
    }
  };

  return {
    purchase: (key: UpgradeKey) => mutation.mutate(key),
    isPurchasing: mutation.isPending,
    pendingKey: mutation.variables,
    getUpgradeCost,
  };
}
