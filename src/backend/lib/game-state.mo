import Types "../types/game-state";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Float "mo:core/Float";

module {
  public type GameStateMap = Map.Map<Types.UserId, Types.GameStateInternal>;

  // CPS contributions per upgrade unit
  let CPU_CPS : Nat = 1;
  let GPU_CPS : Nat = 5;
  let COOLING_CPS : Nat = 15;

  // Base costs per upgrade type
  let CPU_BASE_COST : Nat = 50;
  let GPU_BASE_COST : Nat = 200;
  let COOLING_BASE_COST : Nat = 500;

  // Coins earned per manual click
  let COINS_PER_CLICK : Nat = 1;

  /// Create a fresh game state for a new user
  public func newState() : Types.GameStateInternal {
    {
      var coinBalance = 0;
      var coinsPerSecond = 0;
      var totalClicks = 0;
      var cpuCount = 0;
      var gpuCount = 0;
      var coolingCount = 0;
      var lastSaveTimestamp = Time.now();
    };
  };

  /// Return a shareable snapshot of a user's internal state
  public func toPublic(self : Types.GameStateInternal) : Types.GameState {
    {
      coinBalance = self.coinBalance;
      coinsPerSecond = self.coinsPerSecond;
      totalClicks = self.totalClicks;
      cpuCount = self.cpuCount;
      gpuCount = self.gpuCount;
      coolingCount = self.coolingCount;
      lastSaveTimestamp = self.lastSaveTimestamp;
    };
  };

  /// Accrue passive income based on elapsed time since last save
  public func accruePassiveIncome(self : Types.GameStateInternal) {
    if (self.coinsPerSecond == 0) {
      self.lastSaveTimestamp := Time.now();
      return;
    };
    let now = Time.now();
    let elapsedNanos = now - self.lastSaveTimestamp;
    if (elapsedNanos > 0) {
      let elapsedSeconds = elapsedNanos.toNat() / 1_000_000_000;
      let earned = elapsedSeconds * self.coinsPerSecond;
      self.coinBalance += earned;
    };
    self.lastSaveTimestamp := now;
  };

  /// Add coins earned by a single click
  public func recordClick(self : Types.GameStateInternal) {
    self.totalClicks += 1;
    self.coinBalance += COINS_PER_CLICK;
  };

  /// Return the cost of the next upgrade of the given type
  public func upgradeCost(self : Types.GameStateInternal, upgradeType : Types.UpgradeType) : Nat {
    let (baseCost, owned) = switch upgradeType {
      case (#cpu) { (CPU_BASE_COST, self.cpuCount) };
      case (#gpu) { (GPU_BASE_COST, self.gpuCount) };
      case (#cooling) { (COOLING_BASE_COST, self.coolingCount) };
    };
    let cost = baseCost.toFloat() * Float.pow(1.15, owned.toFloat());
    cost.toInt().toNat();
  };

  /// Apply an upgrade if the user can afford it; return result variant
  public func applyUpgrade(self : Types.GameStateInternal, upgradeType : Types.UpgradeType) : Types.UpgradeResult {
    let cost = upgradeCost(self, upgradeType);
    if (self.coinBalance < cost) {
      return #insufficientFunds { required = cost; available = self.coinBalance };
    };
    self.coinBalance -= cost;
    switch upgradeType {
      case (#cpu) { self.cpuCount += 1 };
      case (#gpu) { self.gpuCount += 1 };
      case (#cooling) { self.coolingCount += 1 };
    };
    recalculateCoinsPerSecond(self);
    #ok(toPublic(self));
  };

  /// Recalculate coinsPerSecond from owned upgrades
  public func recalculateCoinsPerSecond(self : Types.GameStateInternal) {
    self.coinsPerSecond :=
      self.cpuCount * CPU_CPS +
      self.gpuCount * GPU_CPS +
      self.coolingCount * COOLING_CPS;
  };
};
