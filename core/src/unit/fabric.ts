import { generateID } from "../utils";
import { UnitTypes } from "../index";
import { characteristics } from "./index";
import { taunt, unTaunt } from "./effects";

export default function createUnit(type: UnitTypes, ownerId) {
  const _id = generateID();
  const characteristic = characteristics[type] as any;

  const unit = {
    type,
    _id,
    ownerId,
    ...characteristic,
    effects: [],
    counterEffects: []
  };

  switch (type) {
    case UnitTypes.Pawn:
      return unit;

    case UnitTypes.Officer:
      return {
        ...unit,
        effects: [taunt(_id)]
      };

    case UnitTypes.Horse:
      return {
        ...unit,
        effects: [unTaunt(_id)]
      };
  }
}
