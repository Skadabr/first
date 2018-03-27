import { EffectImpact, EffectTargetingScope, EffectTypes } from "../../index";

export { taunt, unTaunt } from "./availability_effects";
export { attack } from "./attack_effects";
export { health } from "./health_effects";

export interface Effect {
  readonly ownerId: string;
  readonly type: EffectTypes;
  readonly impact: EffectImpact;
  readonly targetingScope: EffectTargetingScope;
  readonly value?: any;
}

export const filterEffectsByImpact = (
  effs: Effect[],
  impact: EffectImpact
): Effect[] => {
  return effs.filter(eff => eff.impact === impact);
};

export const filterEffectsNotInTargetingScope = (
  effs: Effect[],
  targetingScope: EffectTargetingScope
): Effect[] => {
  return effs.filter(eff => eff.targetingScope !== targetingScope);
};

export const filterEffectsInTargetingScope = (
  effs: Effect[],
  targetingScope: EffectTargetingScope
): Effect[] => {
  return effs.filter(eff => eff.targetingScope === targetingScope);
};

