import { EffectTypes, EffectImpact, EffectTargetingScope } from "../../index";
import { Effect } from "./index";

export const attack = (
  ownerId,
  targetingScope: EffectTargetingScope,
  attack
): Effect => ({
  ownerId,
  type: EffectTypes.Attack,
  targetingScope,
  impact: EffectImpact.Attack,
  value: attack
});
