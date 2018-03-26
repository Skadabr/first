import {EffectTargetingScope, UnitTypes} from "../src";
import {health} from "../src/unit/effects";

export const state = {
  players: [
    {
      user: {
        _id: "player"
      },
    },
    {
      user: {
        _id: "enemy"
      },
    }
  ],
  units: [
    {
      ownerId: "player",
      type: UnitTypes.Pawn,
      name: "Pawn",
      cost: 1,
      health: 6,
      attack: 1,
      moves: 0,
      effects: []
    },
    {
      ownerId: "player",
      type: UnitTypes.Pawn,
      name: "Pawn",
      cost: 1,
      health: 6,
      attack: 1,
      moves: 0,
      effects: [health(2, EffectTargetingScope.OtherFriendlyMinions)]
    },
    {
      ownerId: "enemy",
      type: UnitTypes.Pawn,
      name: "Pawn",
      cost: 1,
      health: 6,
      attack: 1,
      moves: 0,
      effects: []
    },
  ]
}
