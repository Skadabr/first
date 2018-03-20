import { EffectTargetingScope, EffectApplicabilityStage } from "../../index";
import {
  getUnitIdsByUserId,
} from "./units";

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

export const getEffectsByApplicabilityScope = (state, applicabilityStage) => {
  const effs = getEffects(state).filter(
    eff => eff.applicabilityStage === applicabilityStage
  );
  return effs;
};

