import { EffectTargetingScope, UnitTypes } from "../../index";
import {attack, health} from "../../unit/effects/index";
import createUnit from "../../unit/fabric";

interface State {
  user: any;
  battle: {
    players: any[];
    units: any[];
  };
}

export const state: State = {
  user: {
    _id: "player"
  },
  battle: {
    players: [
      {
        user: {
          _id: "player"
        }
      },
      {
        user: {
          _id: "enemy"
        }
      }
    ],
    units: [
      //
      // player
      //
      {
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "pl_hero",
        hero: true
      },
      {
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "pl_pawn1"
      },
      {
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "pl_pawn2",
        effects: [health(2, EffectTargetingScope.OtherFriendlyMinions)]
      },
      {
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "pl_pawn3",
        effects: [attack(1, EffectTargetingScope.OtherFriendlyMinions)]
      },
      //
      // enemy
      //
      {
        ...createUnit(UnitTypes.Pawn, "enemy"),
        _id: "e_hero",
        hero: true
      },
      {
        ...createUnit(UnitTypes.Pawn, "enemy"),
        _id: "e_pawn3"
      }
    ]
  }
};

