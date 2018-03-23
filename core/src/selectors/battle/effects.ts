import { EffectImpact, EffectTargetingScope } from "../../index";
import {
  getUnitById,
  getUnitIdsByTargetingScope,
  getUnitIdsByUserId,
  getUnits
} from "./units";
import { uniqueArray } from "../../utils";
import {
  filterEffectsByImpact,
  filterEffectsInTargetingScope
} from "../../unit/effects";
import { getUnitEffects } from "../../unit/methods";

export const getEffects = state => {
  return getUnits(state).reduce((sum, { effects }) => [...sum, ...effects], []);
};

export const getEffectsByUnitId = (state, unitId) => {
  const effs = getUnitById(state, unitId).effects;
  return effs;
};

export const getEffectsByUserId = (state, userId) => {
  const unitIds = getUnitIdsByUserId(state, userId);
  const effs = unitIds.reduce((sum, unitId) =>
    [...sum, ...getEffectsByUnitId(state, unitId)]
  );
  return effs;
};

export const getEffectsByImpact = (state, impact) => {
  const effs = filterEffectsByImpact(getEffects(state), impact);
  return effs;
};


export const isEffectApplicableToUnit = (state, eff, unitId) => {
  const targetIds = getUnitIdsByTargetingScope(
    state,
    eff.ownerId,
    eff.targetingScope
  );
  return targetIds.includes(unitId);
};

export const getEffectsApplicableToUnit = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const effs = getEffects(state);
  const localUnitEffects = filterEffectsInTargetingScope(
    getUnitEffects(unit),
    EffectTargetingScope.Local
  );
  const acc = [...localUnitEffects];

  for (const eff of effs)
    if (isEffectApplicableToUnit(state, eff, unitId)) acc.push(eff);

  return acc;
};

export const getUniqueListOfTradeEffectTypes = (state, unitId) => {
  const effs = filterEffectsByImpact(
    getEffectsByUnitId(state, unitId),
    EffectImpact.Trade
  );
  return uniqueArray(effs.map(eff => eff.type));
};
