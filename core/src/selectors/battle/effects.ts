import { EffectTargetingScope, EffectImpact } from "../../index";
import { getUnitIdsByUserId } from "./units";
import { uniqueArray } from "../../utils";

//
// ============ general effects selectors ============
//

export const getEffects = state => state.effects;

export const getEffectsByUnitId = (state, unitId) => {
  const effs = state.effects.filter(({ ownerId }) => ownerId === unitId);
  return effs;
};

export const getEffectsByUserId = (state, userId) => {
  const unitIds = getUnitIdsByUserId(state, userId);
  const effs = unitIds.reduce((sum, unitId) => {
    [...sum, ...getEffectsByUnitId(state, unitId)];
  });
  return effs;
};

export const getEffectsByImpact = (state, impact) => {
  const effs = getEffects(state).filter(eff => eff.impact === impact);
  return effs;
};

export const filterEffectsByImpact = (effs, impact) => {
  return effs.filter(eff => eff.impact === impact);
};

export const getUniqueListOfTradeEffectTypes = (state, unitId) => {
  const effs = filterEffectsByImpact(
    getEffectsByUnitId(state, unitId),
    EffectImpact.Trade
  );
  return uniqueArray(effs.map(eff => eff.type));
};

export function getUnitEffects(target) {
  return target.effects;
}

export function getUnitCounterEffects(target) {
  return target.counterEffects;
}
