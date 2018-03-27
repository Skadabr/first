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
        expect(ev.payload).toMatchObject({ unitId: "pl_pawn1", value: 7 });
        done();
      });
      battle.attack("e_pawn3", "pl_pawn1");
    });

    it("should return unit with updated `counterEffects`", function() {
      battle.attack("e_pawn3", "pl_pawn1");

      const unit = battle.getUnit("pl_pawn1");
      const counterEffects = unit.counterEffects;

      expect(counterEffects).toMatchObject([
        {
          ownerId: "pl_pawn2",
          value: 1,
          type: "HEALTH"
        }
      ]);
    });

    describe("when attack unit until user become dead", () => {
      it("should emit event about unit death", function (done) {
        battle.on("event", ev => {
          if (ev.type === "UNITS_REMOVE") {
            done();
          }
        })
        for (let i = 0; i < 8; i++) {
          battle.attack("e_pawn3", "pl_pawn1");
        }
      });

      it("should not return unit on `getUnit`", function () {
        const unitBeforeAttack = battle.getUnit('pl_pawn1');
        expect(unitBeforeAttack).not.toEqual(undefined);

        for (let i = 0; i < 8; i++) {
          battle.attack("e_pawn3", "pl_pawn1");
        }

        const unitAfterAttack = battle.getUnit('pl_pawn1');
        expect(unitAfterAttack).toEqual(undefined);
      });
    });
  });
});

describe("Battle add unit", () => {
  
});
