import { EffectTargetingScope, UnitTypes } from "../../index";
import { attack, health } from "../../unit/effects/index";
import createUnit from "../../unit/fabric";

export interface State {
  user: any;
  battle: {
    turnOwner: string;
    players: any[];
    units: any[];
  };
}

export const baseState: State = {
  user: {
    _id: "player"
  },
  battle: {
    turnOwner: "player",
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
      // player
      //
      {
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "p_hero",
        hero: true
      },

      // enemy
      //
      {
        ...createUnit(UnitTypes.Pawn, "enemy"),
        _id: "e_hero",
        hero: true
      }
    ]

    // cards: [
    //   {
    //     ...createCard(UnitTypes.Pawn, 'player'),
    //     _id: 'pl_card1'
    //   }
    // ]
  }
};
