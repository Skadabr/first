import {EffectScope, EffectImpact} from "../../constants";
import { getUnit, getUnits, getPlayerUnits, getOpponentUnits } from ".";

//
// ============ general effects selectors ============
//

export const getAllEffects = state =>
  getUnits(state).reduce((effects, unit) => [...effects, ...unit.effects], []);

export const getPlayerUnitsEffects = state =>
  getPlayerUnits(state).reduce(
    (effects, unit) => [...effects, ...unit.effects],
    []
  );

export const getOpponentUnitsEffects = state =>
  getOpponentUnits(state).reduce(
    (effects, unit) => [...effects, ...unit.effects],
    []
  );

export const getEffects = (state, unit_id) => getUnit(state, unit_id).effects;

//
// ============
//

export const getGlobalEffects = state =>
  getAllEffects(state).filter(eff => eff.scope === EffectScope.Global);

export const getGlobalTargetEffects = state =>
  getGlobalTargetEffects(state).filter(eff => eff.impact === EffectImpact.Target);

export const getTargetEffects = (state, unit_id) =>
  getEffects(state, unit_id).filter(
    eff => eff.impact === EffectImpact.Target && eff.scope === EffectScope.Local
  );
