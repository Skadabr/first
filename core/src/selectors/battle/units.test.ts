import dcopy from "deep-copy";

import { baseState } from "../../__tests__/fixtures/state-fixture";
import {
  getEnemyHero,
  getEnemyMinionsByUserId,
  getEnemyUnitIdsByUserId,
  getEnemyUnits,
  getEnemyUnitsByUserId,
  getHero,
  getMinionsByUserId,
  getPlayerUnits,
  getUnitById,
  getUnitFriendlyMinions,
  getUnitFriendlyUnits,
  getUnitIdsByUserId,
  getUnitsByTargetingScope,
  getUnitsByUserId
} from "./units";
import { EffectTargetingScope, UnitTypes } from "../../index";
import createUnit from "../../unit/fabric";
import {addTestUnit} from "../../__tests__/utils";

describe("Units selectors", () => {
  let state;

  beforeAll(function initState() {
    state = dcopy(baseState);

    addTestUnit(state, "pl_pawn1",  UnitTypes.Pawn,"player");
    addTestUnit(state, "pl_pawn2",  UnitTypes.Pawn,"player");
    addTestUnit(state, "pl_pawn3",  UnitTypes.Pawn,"player");
    addTestUnit(state, "e_pawn1",  UnitTypes.Pawn,"enemy");
  });

  describe("getUnitById", () => {
    it("should return a unit", function() {
      const unit = getUnitById(state, "pl_pawn1");
      expect(unit).toMatchSnapshot();
    });
  });

  describe("getUnitsByUserId", () => {
    it("should return list of `player` users", function() {
      const units = getUnitsByUserId(state, "player");
      expect(units).toMatchSnapshot();
    });
  });

  describe("getMinionsByUserId", () => {
    it("should return list of `player` users", function() {
      const units = getMinionsByUserId(state, "player");
      expect(units).toMatchSnapshot();
    });
  });

  describe("getHero", () => {
    describe("when there are many hero for one player", () => {
      let newState;

      beforeEach(function() {
        newState = dcopy(state);
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
      expect(units).toMatchSnapshot();
    });
  });

  describe("getEnemyMinionsByUserId", () => {
    it("should return all enemy minions of player which has passed id", function() {
      const units = getEnemyMinionsByUserId(state, "player");
      expect(units).toMatchSnapshot();
    });
  });

  describe("getEnemyHero", () => {
    describe("when there are many hero for one player", () => {
      let newState;

      beforeEach(function() {
        newState = dcopy(state);
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
      expect(ids).toMatchSnapshot();
    });
  });

  describe("getEnemyUnitIdsByUserId", () => {
    it("should return list of all ids of `enemy`", function() {
      const ids = getEnemyUnitIdsByUserId(state, "player");
      expect(ids).toMatchSnapshot();
    });
  });

  describe("getPlayerUnits", () => {
    it("should return units of current player", function() {
      const units = getPlayerUnits(state);
      expect(units).toMatchSnapshot();
    });
  });

  describe("getEnemyUnits", () => {
    it("should return units of enemy of the current user", function() {
      const units = getEnemyUnits(state);
      expect(units).toMatchSnapshot();
    });
  });

  describe("getUnitFriendlyMinions", () => {
    it("should return list of friendly minions", function() {
      const units = getUnitFriendlyMinions(state, "pl_pawn1");
      expect(units).toMatchSnapshot();
    });
  });

  describe("getUnitFriendlyUnits", () => {
    it("should return list of all friendly units", function() {
      const units = getUnitFriendlyUnits(state, "pl_pawn1");
      expect(units).toMatchSnapshot();
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
      expect(units).toMatchSnapshot();
    });

    test("get all friendly minions", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.AllFriendlyMinions
      );
      expect(units).toMatchSnapshot();
    });

    test("get all friendly units", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.AllFriendlyUnits
      );
      expect(units).toMatchSnapshot();
    });

    test("get all enemy units", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.AllEnemyUnits
      );
      expect(units).toMatchSnapshot();
    });

    test("get all enemy minions", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.AllEnemyMinions
      );
      expect(units).toMatchSnapshot();
    });

    test("get all units", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.AllUnits
      );
      expect(units).toMatchSnapshot();
    });

    test("get local unit", function() {
      const units = getUnitsByTargetingScope(
        state,
        sourceId,
        EffectTargetingScope.Local
      );
      expect(units).toMatchSnapshot();
    });
  });
});
