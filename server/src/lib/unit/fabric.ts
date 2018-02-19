import flatMap from "lodash.flatmap";

import { UnitTypes } from "../../constants";
import { UnitBasicCharacteristic } from ".";

import { createActions, createAttackAction } from "../actions";
import { createToggleActivityEffect } from "../effects";

export default function createUnit(type: UnitTypes) {
  switch (type) {
    case UnitTypes.Pawn:
      return {
        ...UnitBasicCharacteristic[UnitTypes.Pawn],

        effects: [createToggleActivityEffect()],

        findUnitTargets() {},

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

    case UnitTypes.Officer:
      return {
        ...UnitBasicCharacteristic[UnitTypes.Officer],

        effects: [createToggleActivityEffect()],

        findUnitTargets() {},

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
