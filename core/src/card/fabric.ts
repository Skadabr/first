import { UnitTypes } from "../index";
import { generateID } from "../utils";
import { createUnit } from "../unit/index";

export function createCard(type: UnitTypes, ownerId) {
  switch (type) {
    case UnitTypes.Pawn:
      return {
        type,
        ownerId,
        _id: generateID(),
        unit: createUnit(type, ownerId)
      };

    case UnitTypes.Officer:
      return {
        type,
        ownerId,
        _id: generateID(),
        unit: createUnit(type, ownerId)
      };

    case UnitTypes.Horse:
      return {
        type,
        ownerId,
        _id: generateID(),
        unit: createUnit(type, ownerId)
      };
  }
}
