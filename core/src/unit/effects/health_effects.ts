import {
  HEALTH
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact } from "../../index";

export const health = (health, targetingScope) => ({
  _id: generateID(),
  type: HEALTH,
  targetingScope,
  impact: EffectImpact.Health,
  value: health
});
