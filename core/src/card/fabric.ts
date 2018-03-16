import { UnitTypes } from "../index";
import { generateID } from "../utils";
import { createUnit } from "../unit/index";

export function createCard(type: UnitTypes, owner_id) {
  switch (type) {
    case UnitTypes.Pawn:
      return {
        type,
        owner_id,
        _id: generateID(),
        unit: createUnit(type, owner_id)
      };

    case UnitTypes.Officer:
      return {
        type,
        owner_id,
        _id: generateID(),
        unit: createUnit(type, owner_id)
      };

    case UnitTypes.Horse:
      return {
        type,
        owner_id,
        _id: generateID(),
        unit: createUnit(type, owner_id)
      };
  }
}
