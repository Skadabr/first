import flatMap from "lodash.flatmap";

import { UnitTypes } from "../../constants";
import { createUnit } from "../unit";
import { CardCharacteristics } from ".";

export default function createCard(type: UnitTypes, opts) {
  const { cardEffects = [], owner_id } = opts;

  const effects = [...CardCharacteristics[type].effects, ...cardEffects];

  switch (type) {
    case UnitTypes.Pawn:
      return {
        type,
        owner_id,
        _id: Math.random().toString(),
        unit: createUnit(type, opts),
        effects
      };

    case UnitTypes.Officer:
      return {
        type,
        owner_id,
        _id: Math.random().toString(),
        unit: createUnit(type, opts),
        effects
      };
  }
}
