import { state } from "./__tests__/fixtures/state-fixture";
import { Battle } from "./index";

describe("Battle", () => {
  it("should just work", function() {
    const battle = new Battle(state.battle, state.user);
    const newState = battle.toJSON();
    expect(newState.battle).toMatchObject(state.battle);
  });
});

describe("Battle attack", () => {
  let battle;

  beforeEach(function createBattle() {
    battle = new Battle(state.battle, state.user);
  });

  describe("just attack blabla", () => {
    it("should emit event about setting health", function(done) {
      battle.on("event", ev => {
        expect(ev.type).toEqual("UNIT_SET_HEALTH");
        expect(ev.payload).toMatchObject({ unitId: "pl_pawn1", value: 8 });
        done();
      });
      battle.attack("e_pawn3", "pl_pawn1");
    });

    it("should return unit with updated `counterEffects`", function () {
      battle.attack("e_pawn3", "pl_pawn1");
      const counterEffects = battle.getUnit('pl_pawn1').counterEffects
      expect(counterEffects).toMatchObject([
        {
          ownerId: "pl_pawn2",
          value: 1,
          type: "HEALTH",
        }
      ])
    });
  });
});
