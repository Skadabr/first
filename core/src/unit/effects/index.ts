import {EffectImpact, EffectTargetingScope, EffectTypes} from "../../index";

export { taunt, tauntDisabler } from "./availability_effects";
export { attack } from "./attack_effects";
export { health } from "./health_effects";

export interface Effect {
  _id: string;
  type: EffectTypes;
  impact: EffectImpact;
  targetingScope: EffectTargetingScope;
  value?: any;
}

export const filterEffectsByImpact = (effs, impact) => {
  return effs.filter(eff => eff.impact === impact);
};

export const filterEffectsNotInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope !== targetingScope);
};

export const filterEffectsInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope === targetingScope);
};
