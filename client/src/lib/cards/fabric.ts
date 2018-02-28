import flatMap from "lodash.flatmap";

import { UnitTypes } from "../../constants";
import { generateID } from "../../utils/common";
import { createUnit } from "../unit";

export default function createCard(type: UnitTypes, owner_id) {
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
  }
}
