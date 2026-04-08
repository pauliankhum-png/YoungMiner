import Types "../types/game-state";
import GameStateLib "../lib/game-state";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (gameStates : Map.Map<Types.UserId, Types.GameStateInternal>) {

  /// Get or create game state, accrue passive income, save, return state.
  public shared ({ caller }) func getGameState() : async Types.GameState {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let state = switch (gameStates.get(caller)) {
      case (?s) { s };
      case null {
        let s = GameStateLib.newState();
        gameStates.add(caller, s);
        s;
      };
    };
    state.accruePassiveIncome();
    state.toPublic();
  };

  /// Load saved game state for the authenticated user. Returns null if no saved state.
  public shared query ({ caller }) func loadGameState() : async ?Types.GameState {
    if (caller.isAnonymous()) return null;
    switch (gameStates.get(caller)) {
      case (?s) { ?s.toPublic() };
      case null { null };
    };
  };

  /// Record a manual click: accrues passive income, adds click coins, saves state.
  public shared ({ caller }) func collectCoins() : async Types.GameState {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let state = switch (gameStates.get(caller)) {
      case (?s) { s };
      case null {
        let s = GameStateLib.newState();
        gameStates.add(caller, s);
        s;
      };
    };
    state.accruePassiveIncome();
    state.recordClick();
    state.toPublic();
  };

  /// Record a manual click: accrues passive income, adds click coins, saves state.
  public shared ({ caller }) func click() : async Types.GameState {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let state = switch (gameStates.get(caller)) {
      case (?s) { s };
      case null {
        let s = GameStateLib.newState();
        gameStates.add(caller, s);
        s;
      };
    };
    state.accruePassiveIncome();
    state.recordClick();
    state.toPublic();
  };

  /// Purchase an upgrade for the caller. Returns ok with updated state or insufficientFunds.
  public shared ({ caller }) func purchaseUpgrade(upgradeType : Types.UpgradeType) : async Types.UpgradeResult {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let state = switch (gameStates.get(caller)) {
      case (?s) { s };
      case null {
        let s = GameStateLib.newState();
        gameStates.add(caller, s);
        s;
      };
    };
    state.accruePassiveIncome();
    state.applyUpgrade(upgradeType);
  };

  /// Purchase an upgrade for the caller. Returns ok with updated state or insufficientFunds.
  public shared ({ caller }) func buyUpgrade(upgradeType : Types.UpgradeType) : async Types.UpgradeResult {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let state = switch (gameStates.get(caller)) {
      case (?s) { s };
      case null {
        let s = GameStateLib.newState();
        gameStates.add(caller, s);
        s;
      };
    };
    state.accruePassiveIncome();
    state.applyUpgrade(upgradeType);
  };

  /// Return cost of the next upgrade tier for the caller.
  public shared query ({ caller }) func getUpgradeCost(upgradeType : Types.UpgradeType) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    switch (gameStates.get(caller)) {
      case (?s) { s.upgradeCost(upgradeType) };
      case null {
        // Return base costs for new users
        switch upgradeType {
          case (#cpu) { 50 };
          case (#gpu) { 200 };
          case (#cooling) { 500 };
        };
      };
    };
  };

  /// Reset the caller's game state to default.
  public shared ({ caller }) func resetGameState() : async () {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    let fresh = GameStateLib.newState();
    gameStates.add(caller, fresh);
  };
};
