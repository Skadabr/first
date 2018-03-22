import {
  INCREASE_HEALTH_TO_FRIENDS
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact } from "../../index";

export const increaseHealthToFriends = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  targetingScope: EffectTargetingScope.OtherFriendlyMinions,
  impact: EffectImpact.Health,
  priority: 5,
  payload: { health }
});
