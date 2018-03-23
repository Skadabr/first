import {
  ATTACK,
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectImpact } from "../../index";

export const attack = (attack, targetingScope) => ({
  _id: generateID(),
  type: ATTACK,
  targetingScope,
  impact: EffectImpact.Attack,
  value: attack
});
