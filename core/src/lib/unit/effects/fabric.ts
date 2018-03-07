import {
  TAUNT,
  TAUNT_DISABLER,
  INCREASE_MOVES,
  INCREASE_ATTACK_TO_FRIENDS,
  INCREASE_HEALTH_TO_FRIENDS
} from "./index";

import { generateID } from "../../../utils";
import { EffectScope, EffectImpact } from "../../../constants";

export const taunt = () => ({
  _id: generateID(),
  type: TAUNT,
  scope: EffectScope.Global,
  impact: EffectImpact.Availability,
  priority: 5
});

export const tauntDisabler = () => ({
  _id: generateID(),
  type: TAUNT_DISABLER,
  scope: EffectScope.Global,
  impact: EffectImpact.Availability,
  priority: 6
});

export const increaseMoves = amount => ({
  _id: generateID(),
  type: INCREASE_MOVES,
  scope: EffectScope.Local,
  impact: EffectImpact.Move,
  priority: 5
});

export const increaseAttackToFrieands = damage => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.Attack,
  priority: 5,
  payload: { damage }
});

export const increaseHealthToFriends = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.Attack,
  priority: 5,
  payload: { health }
});
