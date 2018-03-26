import { EffectTargetingScope, EffectImpact, EffectTypes } from "../../index";
import { Effect } from "./index";

export const taunt = (ownerId): Effect => ({
  ownerId,
  type: EffectTypes.Taunt,
  targetingScope: EffectTargetingScope.OtherFriendlyMinions,
  impact: EffectImpact.Availability
});

export const unTaunt = (ownerId): Effect => ({
  ownerId,
  type: EffectTypes.UnTaunt,
  targetingScope: EffectTargetingScope.AllEnemyMinions,
  impact: EffectImpact.Availability
});
