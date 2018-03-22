import {
  INCREASE_ATTACK_TO_FRIENDS,
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact } from "../../index";

export const increaseAttackToFrieands = attack => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  targetingScope: EffectTargetingScope.OtherFriendlyMinions,
  impact: EffectImpact.Attack,
  priority: 5,
  payload: { attack }
});
