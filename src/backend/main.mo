import Types "types/game-state";
import GameStateApiMixin "mixins/game-state-api";
import Map "mo:core/Map";

actor {
  let gameStates = Map.empty<Types.UserId, Types.GameStateInternal>();

  include GameStateApiMixin(gameStates);
};
