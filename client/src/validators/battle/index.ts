import { MAX_UNITS_ON_FIELD, POSITIONS } from "../../constants";

export function validateAddUnitParams(card, player, position) {
  if (player.money < card.unit.cost) {
    return {
      error: {
        message: "You don't have enough money"
      }
    };
  }

  if (
    player.user._id !== card.owner_id ||
    player.user._id !== card.unit.owner_id
  ) {
    return {
      error: {
        message: "You going to add card to other player"
      }
    };
  }

  if (position < 0 || position > POSITIONS) {
    return {
      error: {
        message: "Position is out of range"
      }
    };
  }

  if (player.units.length > MAX_UNITS_ON_FIELD) {
    return {
      error: {
        message: "There to many units on a field"
      }
    };
  }

  return {};
}
