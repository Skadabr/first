export const TAUNT = "TAUNT";
export const TAUNT_DISABLER = "TAUNT_DISABLER";
export const INCREASE_MOVES = "INCREASE_MOVES";
export const ATTACK = "ATTACK";
export const HEALTH = "HEALTH";

export { taunt, tauntDisabler } from "./availability_effects";
export { attack } from "./attack_effects";
export { health } from "./health_effects";


export const filterEffectsByImpact = (effs, impact) => {
  return effs.filter(eff => eff.impact === impact);
};

export const filterEffectsNotInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope !== targetingScope);
};

export const filterEffectsInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope === targetingScope);
};
