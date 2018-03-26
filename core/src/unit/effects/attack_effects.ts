import { generateID } from "../../utils";
import {EffectTypes, EffectImpact, EffectTargetingScope} from "../../index";
import {Effect} from "./index";

export const attack = (attack, targetingScope: EffectTargetingScope) : Effect => ({
  _id: generateID(),
  type: EffectTypes.Attack,
  targetingScope,
  impact: EffectImpact.Attack,
  value: attack
});
