const BATTLEFIELD_UPDATE = "BATTLEFIELD_UPDATE";

const EMPTY = {
  turn_owner: null,
  users: null,
};

interface Unit {
  id: string;
  type: number;
  health: number;
  position: number;
}

interface Player {
  user: {
    name: string;
  };
  units: Unit[];
  hero: {
    health;
  };
  money: number;
}

interface BattleField {
  turn_owner: string;
  player: Player[]
}

export default function battleFieldReducer(state = EMPTY, {type, payload}) {
  switch(type) {
    case BATTLEFIELD_UPDATE:
      return payload;
  }
}

//
// ============ Actions ============
//

export function battleFieldUpdate(battle_field: BattleField) {
  return {
    type: BATTLEFIELD_UPDATE,
    payload: battle_field
  }
}
