import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type UpgradeResult = {
    __kind__: "ok";
    ok: GameState;
} | {
    __kind__: "insufficientFunds";
    insufficientFunds: {
        available: bigint;
        required: bigint;
    };
};
export interface GameState {
    coolingCount: bigint;
    coinBalance: bigint;
    totalClicks: bigint;
    coinsPerSecond: bigint;
    gpuCount: bigint;
    lastSaveTimestamp: Timestamp;
    cpuCount: bigint;
}
export enum UpgradeType {
    cpu = "cpu",
    gpu = "gpu",
    cooling = "cooling"
}
export interface backendInterface {
    buyUpgrade(upgradeType: UpgradeType): Promise<UpgradeResult>;
    click(): Promise<GameState>;
    collectCoins(): Promise<GameState>;
    getGameState(): Promise<GameState>;
    getUpgradeCost(upgradeType: UpgradeType): Promise<bigint>;
    loadGameState(): Promise<GameState | null>;
    purchaseUpgrade(upgradeType: UpgradeType): Promise<UpgradeResult>;
    resetGameState(): Promise<void>;
}
