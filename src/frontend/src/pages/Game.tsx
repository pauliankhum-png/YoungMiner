import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/useGameState";
import { useMining } from "@/hooks/useMining";
import { useUpgrade } from "@/hooks/useUpgrade";
import {
  type GameState,
  UPGRADE_CONFIGS,
  type UpgradeKey,
  formatCoins,
} from "@/types/game";
import { AlertTriangle, Cpu, Layers3, Thermometer, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Cost scaling ──────────────────────────────────────────────────────────────
const BASE_COSTS: Record<UpgradeKey, bigint> = {
  cpu: 50n,
  gpu: 200n,
  cooling: 500n,
};

function getUpgradeCost(key: UpgradeKey, owned: bigint): bigint {
  return BigInt(Math.floor(Number(BASE_COSTS[key]) * 1.15 ** Number(owned)));
}

function getOwnedCount(state: GameState, key: UpgradeKey): bigint {
  if (key === "cpu") return state.cpuCount;
  if (key === "gpu") return state.gpuCount;
  return state.coolingCount;
}

// ── Icon helper ───────────────────────────────────────────────────────────────
function UpgradeIcon({ icon }: { icon: string }) {
  const cls = "w-7 h-7";
  if (icon === "gpu") return <Layers3 className={cls} />;
  if (icon === "cooling") return <Thermometer className={cls} />;
  return <Cpu className={cls} />;
}

// ── Click flash ───────────────────────────────────────────────────────────────
interface CoinFlash {
  id: number;
  x: number;
  y: number;
}

// ── Upgrade card ──────────────────────────────────────────────────────────────
interface UpgradeCardProps {
  upgradeKey: UpgradeKey;
  label: string;
  description: string;
  icon: string;
  owned: bigint;
  cost: bigint;
  canAfford: boolean;
  isPurchasing: boolean;
  onBuy: (key: UpgradeKey) => void;
}

function UpgradeCard({
  upgradeKey,
  label,
  description,
  icon,
  owned,
  cost,
  canAfford,
  isPurchasing,
  onBuy,
}: UpgradeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        className={`p-4 border transition-smooth flex flex-col gap-3 ${
          canAfford
            ? "border-accent/50 bg-card glow-neon-green"
            : "border-border/30 bg-card/60"
        }`}
        data-ocid={`upgrade-card-${upgradeKey}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border ${
              canAfford
                ? "border-accent/50 bg-accent/10 text-glow-accent"
                : "border-border/30 bg-muted/30 text-muted-foreground"
            }`}
          >
            <UpgradeIcon icon={icon} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                {label}
              </h3>
              <Badge
                variant="outline"
                className="text-xs font-mono px-1.5 py-0 h-4 border-accent/30 text-glow-accent"
              >
                ×{Number(owned)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-mono">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 flex-shrink-0 text-glow-accent" />
            <span className="text-xs font-mono font-bold text-glow-accent tabular-nums">
              {formatCoins(cost)} HC
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onBuy(upgradeKey)}
            disabled={!canAfford || isPurchasing}
            className={`h-7 text-xs font-mono font-bold uppercase tracking-wider transition-smooth ${
              canAfford
                ? "bg-accent text-accent-foreground hover:bg-accent/80"
                : "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
            }`}
            data-ocid={`upgrade-buy-${upgradeKey}`}
          >
            {isPurchasing ? "…" : "Upgrade"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Stats row ─────────────────────────────────────────────────────────────────
function StatRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-2 border-b border-border/20 last:border-0">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-mono font-bold tabular-nums ${accent ? "text-glow-accent" : "text-glow-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Game() {
  const { data: serverState, isLoading, isError } = useGameState();
  const { mine, isMining } = useMining();
  const { purchase, isPurchasing, pendingKey } = useUpgrade();

  // Local balance for smooth passive income display
  const [localBalance, setLocalBalance] = useState<bigint>(0n);
  const localBalanceRef = useRef<bigint>(0n);

  // Sync from server
  useEffect(() => {
    if (serverState) {
      localBalanceRef.current = serverState.coinBalance;
      setLocalBalance(serverState.coinBalance);
    }
  }, [serverState]);

  // Passive tick every second
  useEffect(() => {
    if (!serverState || serverState.coinsPerSecond === 0n) return;
    const cps = serverState.coinsPerSecond;
    const id = setInterval(() => {
      localBalanceRef.current = localBalanceRef.current + cps;
      setLocalBalance(localBalanceRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [serverState]);

  // Click flash particles
  const [flashes, setFlashes] = useState<CoinFlash[]>([]);
  const flashIdRef = useRef(0);

  const handleMine = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++flashIdRef.current;
    setFlashes((prev) => [...prev, { id, x, y }]);
    setTimeout(
      () => setFlashes((prev) => prev.filter((f) => f.id !== id)),
      700,
    );
    mine();
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6 p-8"
          data-ocid="game-loading"
        >
          <div className="w-20 h-20 rounded-full border-2 border-accent/50 glow-neon-green flex items-center justify-center">
            <Cpu
              className="w-10 h-10 text-glow-accent"
              style={{ animation: "spin 3s linear infinite" }}
            />
          </div>
          <div className="space-y-3 w-56 text-center">
            <Skeleton className="h-5 w-full mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Syncing rig state…
          </p>
        </div>
      </Layout>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
          data-ocid="game-error"
        >
          <AlertTriangle className="w-14 h-14 text-destructive" />
          <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-destructive">
            Node Offline
          </h2>
          <p className="text-sm font-mono text-muted-foreground max-w-sm">
            Could not connect to the mining network. Check your connection and
            try again.
          </p>
        </div>
      </Layout>
    );
  }

  const state = serverState!;
  const rigPower =
    state.cpuCount * 1n + state.gpuCount * 5n + state.coolingCount * 15n;

  return (
    <Layout>
      <div
        className="flex-1 flex flex-col lg:flex-row overflow-hidden"
        data-ocid="game-main"
      >
        {/* ── Left: Stats ────────────────────────────────────────────────── */}
        <aside className="lg:w-56 xl:w-64 bg-card/80 border-b lg:border-b-0 lg:border-r border-border/40 p-4 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              System Stats
            </h2>
            <div data-ocid="stats-panel">
              <StatRow
                label="Coins/Sec"
                value={`${formatCoins(state.coinsPerSecond)} HC`}
                accent
              />
              <StatRow
                label="Rig Power"
                value={`${formatCoins(rigPower)} TH/s`}
              />
              <StatRow
                label="Total Clicks"
                value={Number(state.totalClicks).toLocaleString()}
              />
              <StatRow
                label="CPU Nodes"
                value={Number(state.cpuCount).toString()}
                accent
              />
              <StatRow
                label="GPU Banks"
                value={Number(state.gpuCount).toString()}
              />
              <StatRow
                label="Cooling"
                value={Number(state.coolingCount).toString()}
              />
            </div>
          </motion.div>
        </aside>

        {/* ── Center: Mine ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6 lg:p-10 bg-background">
          {/* Balance display */}
          <motion.div
            key={localBalance.toString()}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 0.15 }}
            className="text-center"
            data-ocid="coin-balance"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Hash Coin Balance
            </p>
            <span className="text-4xl lg:text-5xl xl:text-6xl font-mono font-bold text-glow-accent tabular-nums">
              {formatCoins(localBalance)}{" "}
              <span className="text-2xl lg:text-3xl text-muted-foreground">
                HC
              </span>
            </span>
          </motion.div>

          {/* Mine button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleMine}
              disabled={isMining}
              className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full border-2 border-accent/60 bg-accent/10 glow-neon-green flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-smooth active:scale-95 hover:bg-accent/20 hover:border-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Click to mine Hash Coins"
              data-ocid="mine-button"
            >
              {/* Spinning halo */}
              <span
                className="absolute inset-0 rounded-full border border-accent/20"
                style={{
                  animation: "spin 10s linear infinite",
                  background:
                    "conic-gradient(from 0deg, transparent 260deg, oklch(var(--accent)/0.35) 360deg)",
                }}
              />
              <span className="absolute inset-5 rounded-full border border-accent/15 bg-accent/5" />

              <span className="relative z-10 flex flex-col items-center gap-1">
                <Zap
                  className="w-12 h-12"
                  style={{
                    color: "oklch(var(--accent))",
                    filter: "drop-shadow(0 0 8px oklch(var(--accent)/0.8))",
                  }}
                />
                <span className="text-xs font-mono font-bold text-glow-accent uppercase tracking-widest">
                  {isMining ? "Mining…" : "Mine"}
                </span>
              </span>

              {/* Click flash particles */}
              <AnimatePresence>
                {flashes.map((f) => (
                  <motion.span
                    key={f.id}
                    initial={{
                      opacity: 1,
                      scale: 0.6,
                      x: f.x - 16,
                      y: f.y - 16,
                    }}
                    animate={{ opacity: 0, scale: 1.4, y: f.y - 52 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="absolute pointer-events-none text-xs font-mono font-bold text-glow-accent"
                  >
                    +1 HC
                  </motion.span>
                ))}
              </AnimatePresence>
            </button>
          </div>

          <p className="text-xs font-mono text-muted-foreground text-center">
            Click to mine · Passive:{" "}
            <span className="text-glow-accent">
              {formatCoins(state.coinsPerSecond)} HC/sec
            </span>
          </p>
        </main>

        {/* ── Right: Upgrades ────────────────────────────────────────────── */}
        <aside className="lg:w-72 xl:w-80 bg-card/80 border-t lg:border-t-0 lg:border-l border-border/40 p-4 flex-shrink-0 overflow-y-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Upgrade Shop
          </h2>
          <div className="flex flex-col gap-3" data-ocid="upgrade-shop">
            {UPGRADE_CONFIGS.map((cfg) => {
              const owned = getOwnedCount(state, cfg.key);
              const cost = getUpgradeCost(cfg.key, owned);
              const canAfford = localBalance >= cost;
              return (
                <UpgradeCard
                  key={cfg.key}
                  upgradeKey={cfg.key}
                  label={cfg.label}
                  description={cfg.description}
                  icon={cfg.icon}
                  owned={owned}
                  cost={cost}
                  canAfford={canAfford}
                  isPurchasing={isPurchasing && pendingKey === cfg.key}
                  onBuy={purchase}
                />
              );
            })}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
