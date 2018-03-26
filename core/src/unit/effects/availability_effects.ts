import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact, EffectTypes } from "../../index";
import { Effect } from "./index";

export const taunt = (): Effect => ({
  _id: generateID(),
  type: EffectTypes.Taunt,
  targetingScope: EffectTargetingScope.OtherFriendlyMinions,
  impact: EffectImpact.Availability
});

export const tauntDisabler = (): Effect => ({
  _id: generateID(),
  type: EffectTypes.UnTaunt,
  targetingScope: EffectTargetingScope.AllEnemyMinions,
  impact: EffectImpact.Availability
});
