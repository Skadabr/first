import applyEffects from "./effects/index";
import {
  taunt,
  tauntDisabler,
  increaseMoves,
  increaseAttackToFrieands,
  increaseHealthToFriends
} from "./effects/fabric";

export { default as characteristics } from "./characteristics";
export { default as createUnit } from "./fabric";

export const effects = {
  applyEffects,
  taunt,
  tauntDisabler,
  increaseMoves,
  increaseAttackToFrieands,
  increaseHealthToFriends
};
