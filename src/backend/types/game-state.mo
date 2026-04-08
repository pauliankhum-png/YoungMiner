import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  // Upgrade category identifiers
  public type UpgradeType = { #cpu; #gpu; #cooling };

  // Per-user game state (internal — uses var fields)
  public type GameStateInternal = {
    var coinBalance : Nat;
    var coinsPerSecond : Nat;
    var totalClicks : Nat;
    var cpuCount : Nat;
    var gpuCount : Nat;
    var coolingCount : Nat;
    var lastSaveTimestamp : Timestamp;
  };

  // Shared (serializable) snapshot for the API boundary
  public type GameState = {
    coinBalance : Nat;
    coinsPerSecond : Nat;
    totalClicks : Nat;
    cpuCount : Nat;
    gpuCount : Nat;
    coolingCount : Nat;
    lastSaveTimestamp : Timestamp;
  };

  // Returned after a purchase to confirm the result
  public type UpgradeResult = {
    #ok : GameState;
    #insufficientFunds : { required : Nat; available : Nat };
  };
};
