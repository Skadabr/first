import flatMap from "lodash.flatmap";
import { createActions } from "../lib/actions";
import { UnitTypes } from "../constants";

export default function createUnit(type: UnitTypes) {
  switch (type) {
    case UnitTypes.Pawn:
      return {
        type: UnitTypes.Pawn,
        name: "Pawn",
        cost: 1,
        init_health: 6,
        damage: 1,

        effects: [createToggleActivityEffect()],

        action(unit, opts) {
          const targets = findUnitTargets();
          return flatMap(targets, t =>
            createActions(
              unit.effects,
              t.effects,
              createAttackAction(unit, target)
            )
          );
        }
      };

    case UnitTypes.Officer:
      return {
        type: UnitTypes.Officer,
        name: "Officer",
        cost: 2,
        init_health: 6,
        damage: 2,

        effects: [createToggleActivityEffect()],

        action(unit, opts) {
          const targets = unit.findUnitTargets();
          return flatMap(targets, t =>
            createActions(
              unit.effects,
              t.effects,
              createAttackAction(unit, target)
            )
          );
        }
      };
  }
}
