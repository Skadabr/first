import copy from "deep-copy";

import { state } from "../../__tests__/fixtures/state-fixture";
import {
  getEnemyHero,
  getEnemyMinionsByUserId,
  getEnemyUnitIdsByUserId,
  getEnemyUnits,
  getEnemyUnitsByUserId,
  getHero,
  getMinionsByUserId,
  getPlayerUnitIds,
  getPlayerUnits,
  getUnitById,
  getUnitFriendlyMinions,
  getUnitFriendlyUnits,
  getUnitIdsByUserId,
  getUnitsByTargetingScope,
  getUnitsByUserId
} from "./units";
import { EffectImpact, EffectTargetingScope, UnitTypes } from "../../index";
import { attack, health } from "../../unit/effects";
import createUnit from "../../unit/fabric";
import { playerDecreseMoney } from "../../actions";

describe("getUnitById", () => {
  it("should return a unit", function() {
    const unit = getUnitById(state, "pl_pawn1");
    expect(unit).toMatchObject({
      ownerId: "player",
      type: UnitTypes.Pawn,
      _id: "pl_pawn1"
    });
  });
});

describe("getUnitsByUserId", () => {
  it("should return list of `player` users", function() {
    const units = getUnitsByUserId(state, "player");
    expect(units).toMatchObject([
      {
        _id: "pl_hero",
        ownerId: "player",
        type: UnitTypes.Pawn,
        hero: true
      },
      {
        _id: "pl_pawn1",
        ownerId: "player",
        type: UnitTypes.Pawn
      },
      {
        _id: "pl_pawn2",
        ownerId: "player",
        type: UnitTypes.Pawn
      },

      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });
});

describe("getMinionsByUserId", () => {
  it("should return list of `player` users", function() {
    const units = getMinionsByUserId(state, "player");
    expect(units).toMatchObject([
      {
        _id: "pl_pawn1",
        ownerId: "player",
        type: UnitTypes.Pawn
      },
      {
        _id: "pl_pawn2",
        ownerId: "player",
        type: UnitTypes.Pawn
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });
});

describe("getHero", () => {
  describe("when there are many hero for one player", () => {
    let newState;

    beforeEach(function() {
      newState = copy(state);
      newState.battle.units.push({
        ...createUnit(UnitTypes.Pawn, "player"),
        _id: "pl_hero2",
        hero: true
      });
    });

    it("should throw an error", function() {
      expect(() => {
        getHero(newState, "player");
      }).toThrow("There should be only one hero");
    });
  });

  describe("when only one hero", () => {
    it("should return unit with `hero` attribute true", function() {
      const hero = getHero(state, "player");
      expect(hero.hero).toBe(true);
    });
  });
});

describe("getEnemyUnitsByUserId", () => {
  it("should return all enemy units of player which has passed id", function() {
    const units = getEnemyUnitsByUserId(state, "player");
    expect(units).toMatchObject([
      {
        ownerId: "enemy",
        _id: "e_hero",
        hero: true
      },
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });
});

describe("getEnemyMinionsByUserId", () => {
  it("should return all enemy minions of player which has passed id", function() {
    const units = getEnemyMinionsByUserId(state, "player");
    expect(units).toMatchObject([
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });
});

describe("getEnemyHero", () => {
  describe("when there are many hero for one player", () => {
    let newState;

    beforeEach(function() {
      newState = copy(state);
      newState.battle.units.push({
        ...createUnit(UnitTypes.Pawn, "enemy"),
        _id: "e_hero2",
        hero: true
      });
    });

    it("should throw an error", function() {
      expect(() => {
        getEnemyHero(newState, "player");
      }).toThrow("There should be only one hero");
    });
  });

  describe("when only one hero", () => {
    it("should return unit with `hero` attribute true", function() {
      const hero = getEnemyHero(state, "player");
      expect(hero.hero).toBe(true);
    });
  });
});

describe("getUnitIdsByUserId", () => {
  it("should return list of all ids of `player`", function() {
    const ids = getUnitIdsByUserId(state, "player");
    expect(ids).toMatchObject(["pl_hero", "pl_pawn1", "pl_pawn2", "pl_pawn3"]);
  });
});

describe("getEnemyUnitIdsByUserId", () => {
  it("should return list of all ids of `enemy`", function() {
    const ids = getEnemyUnitIdsByUserId(state, "player");
    expect(ids).toMatchObject(["e_hero", "e_pawn3"]);
  });
});

describe("getPlayerUnits", () => {
  it("should return units of current player", function() {
    const units = getPlayerUnits(state);
    expect(units).toMatchObject([
      {
        _id: "pl_hero",
        ownerId: "player",
        type: UnitTypes.Pawn,
        hero: true
      },
      {
        _id: "pl_pawn1",
        ownerId: "player",
        type: UnitTypes.Pawn
      },
      {
        _id: "pl_pawn2",
        ownerId: "player",
        type: UnitTypes.Pawn
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });
});

describe("getEnemyUnits", () => {
  it("should return units of enemy of the current user", function() {
    const units = getEnemyUnits(state);
    expect(units).toMatchObject([
      {
        ownerId: "enemy",
        _id: "e_hero",
        hero: true
      },
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });
});

describe("getUnitFriendlyMinions", () => {
  it("should return list of friendly minions", function() {
    const units = getUnitFriendlyMinions(state, "pl_pawn1");
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });
});

describe("getUnitFriendlyUnits", () => {
  it("should return list of all friendly units", function() {
    const units = getUnitFriendlyUnits(state, "pl_pawn1");
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_hero",
        hero: true
      },
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });
});

describe("getUnitsByTargetingScope", () => {
  const sourceId = "pl_pawn1";

  test("get other friendly minions", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.OtherFriendlyMinions
    );
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });

  test("get all friendly minions", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.AllFriendlyMinions
    );
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_pawn1"
      },
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });

  test("get all friendly units", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.AllFriendlyUnits
    );
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_hero",
        hero: true
      },
      {
        ownerId: "player",
        _id: "pl_pawn1"
      },
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      }
    ]);
  });

  test("get all enemy units", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.AllEnemyUnits
    );
    expect(units).toMatchObject([
      {
        ownerId: "enemy",
        _id: "e_hero",
        hero: true
      },
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });

  test("get all enemy minions", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.AllEnemyMinions
    );
    expect(units).toMatchObject([
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });

  test("get all units", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.AllUnits
    );
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_hero",
        hero: true
      },
      {
        ownerId: "player",
        _id: "pl_pawn1"
      },
      {
        ownerId: "player",
        _id: "pl_pawn2"
      },
      {
        ownerId: "player",
        _id: "pl_pawn3"
      },
      {
        ownerId: "enemy",
        _id: "e_hero",
        hero: true
      },
      {
        ownerId: "enemy",
        _id: "e_pawn3"
      }
    ]);
  });

  test("get local unit", function() {
    const units = getUnitsByTargetingScope(
      state,
      sourceId,
      EffectTargetingScope.Local
    );
    expect(units).toMatchObject([
      {
        ownerId: "player",
        _id: "pl_pawn1"
      }
    ]);
  });
});
