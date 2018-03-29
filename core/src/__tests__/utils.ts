import createUnit from "../unit/fabric";
import { EffectTargetingScope, UnitTypes } from "../index";
import { createCounterEffect } from "../unit/trade";

export function addTestUnit(state, _id, type, ownerId, hero = false) {
  state.battle.units.push({
    ...createUnit(UnitTypes.Pawn, ownerId),
    _id,
    hero
  });
}

export function addTestEffectToUnit(
  state,
  unitId: string,
  effect,
) {
  const unit = state.battle.units.find(u => u._id === unitId);
  if (!unit) throw Error("Unit not found");
  unit.effects.push(effect);
}

export function addTestCounterEffectToUnit(state, unitId: string, effect) {
  const unit = state.battle.units.find(u => u._id === unitId);
  if (!unit) throw Error("Unit not found");
  unit.counterEffects.push(effect);
}
