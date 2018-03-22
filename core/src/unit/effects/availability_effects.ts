import {
  TAUNT,
  TAUNT_DISABLER,
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact } from "../../index";

export const taunt = () => ({
  _id: generateID(),
  type: TAUNT,
  targetingScope: EffectTargetingScope.OtherFriendlyMinions,
  impact: EffectImpact.Availability,
  priority: 5
});

export const tauntDisabler = () => ({
  _id: generateID(),
  type: TAUNT_DISABLER,
  targetingScope: EffectTargetingScope.AllEnemyMinions,
  impact: EffectImpact.Availability,
  priority: 6
});
