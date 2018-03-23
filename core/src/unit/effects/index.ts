export const TAUNT = "TAUNT";
export const TAUNT_DISABLER = "TAUNT_DISABLER";
export const INCREASE_MOVES = "INCREASE_MOVES";
export const INCREASE_ATTACK_TO_FRIENDS = "INCREASE_ATTACK_TO_FRIENDS";
export const INCREASE_HEALTH_TO_FRIENDS = "INCREASE_HEALTH_TO_FRIENDS";

export const filterEffectsByImpact = (effs, impact) => {
  return effs.filter(eff => eff.impact === impact);
};

export const filterEffectsNotInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope !== targetingScope);
};

export const filterEffectsInTargetingScope = (effs, targetingScope) => {
  return effs.filter(eff => eff.targetingScope === targetingScope);
};
