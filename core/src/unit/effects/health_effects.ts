import {EffectImpact, EffectTargetingScope, EffectTypes} from "../../index";
import {Effect} from "./index";

export const health = (ownerId, targetingScope: EffectTargetingScope, health) : Effect => ({
  ownerId,
  type: EffectTypes.Health,
  targetingScope,
  impact: EffectImpact.Health,
  value: health
});
