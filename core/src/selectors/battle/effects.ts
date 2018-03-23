import {EffectImpact} from "../../index";
import {getUnitIdsByUserId} from "./units";
import {uniqueArray} from "../../utils";
import {filterEffectsByImpact} from "../../unit/effects";

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
  const effs = filterEffectsByImpact(getEffects(state));
  return effs;
};



export const getUniqueListOfTradeEffectTypes = (state, unitId) => {
  const effs = filterEffectsByImpact(
    getEffectsByUnitId(state, unitId),
    EffectImpact.Trade
  );
  return uniqueArray(effs.map(eff => eff.type));
};
