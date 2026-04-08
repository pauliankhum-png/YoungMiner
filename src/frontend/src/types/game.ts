export interface GameState {
  coinBalance: bigint;
  coinsPerSecond: bigint;
  totalClicks: bigint;
  cpuCount: bigint;
  gpuCount: bigint;
  coolingCount: bigint;
  lastSaveTimestamp: bigint;
}

export type UpgradeType = { cpu: null } | { gpu: null } | { cooling: null };

export type UpgradeResult =
  | { ok: GameState }
  | { insufficientFunds: { required: bigint; available: bigint } };

export type UpgradeKey = "cpu" | "gpu" | "cooling";

export interface UpgradeConfig {
  key: UpgradeKey;
  label: string;
  description: string;
  baseCpsBoost: bigint;
  icon: string;
}

export const UPGRADE_CONFIGS: UpgradeConfig[] = [
  {
    key: "cpu",
    label: "Quantum CPU",
    description:
      "Next-gen processor that extracts Hash Coins via quantum computation.",
    baseCpsBoost: 5n,
    icon: "cpu",
  },
  {
    key: "gpu",
    label: "Voltaic GPU",
    description:
      "High-voltage graphics unit for parallel hash rendering at terahash speeds.",
    baseCpsBoost: 20n,
    icon: "gpu",
  },
  {
    key: "cooling",
    label: "Liquid Cooling",
    description:
      "Cryo-loop cooling system that keeps your rig running at peak efficiency.",
    baseCpsBoost: 2n,
    icon: "cooling",
  },
];

export function formatCoins(value: bigint): string {
  const n = Number(value);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function makeUpgradeType(key: UpgradeKey): UpgradeType {
  if (key === "cpu") return { cpu: null };
  if (key === "gpu") return { gpu: null };
  return { cooling: null };
}
