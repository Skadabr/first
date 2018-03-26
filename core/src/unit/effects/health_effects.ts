import { generateID } from "../../utils";
import {EffectImpact, EffectTargetingScope, EffectTypes} from "../../index";
import {Effect} from "./index";

export const health = (health, targetingScope: EffectTargetingScope) : Effect => ({
  _id: generateID(),
  type: EffectTypes.Health,
  targetingScope,
  impact: EffectImpact.Health,
  value: health
});
