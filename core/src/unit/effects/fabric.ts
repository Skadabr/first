import {
  TAUNT,
  TAUNT_DISABLER,
  INCREASE_MOVES,
  INCREASE_ATTACK_TO_FRIENDS,
  INCREASE_HEALTH_TO_FRIENDS
} from "./index";

import { generateID } from "../../utils";
import { EffectTargetingScope, EffectApplicabilityStage } from "../../index";

export const taunt = () => ({
  _id: generateID(),
  type: TAUNT,
  scope: EffectTargetingScope.Global,
  impact: EffectApplicabilityStage.Availability,
  priority: 5
});

export const tauntDisabler = () => ({
  _id: generateID(),
  type: TAUNT_DISABLER,
  scope: EffectTargetingScope.Global,
  impact: EffectApplicabilityStage.Availability,
  priority: 6
});

export const increaseMoves = amount => ({
  _id: generateID(),
  type: INCREASE_MOVES,
  scope: EffectTargetingScope.Local,
  impact: EffectApplicabilityStage.Move,
  priority: 5
});

export const increaseAttackToFrieands = attack => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  scope: EffectTargetingScope.Global,
  impact: EffectApplicabilityStage.Attack,
  priority: 5,
  payload: { attack }
});

export const increaseHealthToFriends = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  scope: EffectTargetingScope.Global,
  impact: EffectApplicabilityStage.Attack,
  priority: 5,
  payload: { health }
});
