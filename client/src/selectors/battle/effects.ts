import { EffectScope, EffectImpact } from "../../constants";
import { getUnit, getUnits, getPlayerUnits, getOpponentUnits } from ".";

//
// ============ general effects selectors ============
//

export const getAllEffects = (state, owner_id) =>
  getUnits(state)
    .filter(unit => owner_id === undefined || unit.owner_id === owner_id)
    .reduce((effects, unit) => [...effects, ...unit.effects], []);

export const getEffects = (state, unit_id) => getUnit(state, unit_id).effects;


export const getFilteredEffects = (
  state,
  {
    scope,
    impact,
    unit_id,
    owner_id
  }: { scope?: number; impact?: number; unit_id?: string; owner_id?: string }
) => {
  const effects = unit_id
    ? getEffects(state, unit_id)
    : getAllEffects(state, owner_id);

  return effects.filter(
    eff =>
      (scope === undefined || eff.scope === scope) &&
      (impact === undefined || eff.impact === impact)
  );
};
