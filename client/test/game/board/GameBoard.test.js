import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import WarriorTypes from "../../../src/warrior_types";
import { GameBoard } from "../../../src/components/game/board/GameBoard";
import WarriorList from "../../../src/components/game/board/WarriorList";
import {  ME, OPPONENT } from "../../../src/actions/game.actions";

const me = {
  name: "Oleg",
  health: 30,
  warriors: [
    {
      ...WarriorTypes.pawn,
      position: 4
    }
  ]
};

const opponent = {
  name: "Jack",
  health: 30,
  warriors: [
    {
      ...WarriorTypes.officer,
      position: 4
    }
  ]
};

describe("<GameBoard />", function() {
  context("when fight is false", function() {
    const fight = false;

    it("don't render anything ", function() {
      this.gameBoard = shallow(<GameBoard fight={fight} game={{}} />);
      expect(this.gameBoard.children().length).to.be.equal(0);
    });
  });

  context("when fight is true", function() {
    const fight = true;

    it("render game board", function() {
      this.gameBoard = shallow(<GameBoard fight={fight} game={{}} />);
      expect(this.gameBoard.children().length).not.to.be.equal(0);
    });

    it("act only on its own turn", function() {
      const game = { turn: true, [ME]: me, [OPPONENT]: opponent };
      this.addWarrior = sinon.spy();
      this.gameBoard = shallow(
        <GameBoard
          fight={fight}
          game={game}
          addWarrior={this.addWarrior}
        />
      );

      this.gameBoard
        .find(WarriorList)
        .dive()
        .find(".card-block")
        .at(0)
        .simulate("click", {
          currentTarget: { dataset: { ...WarriorTypes.pawn } }
        });

      sinon.assert.calledWithExactly(this.addWarrior, ME, game, { ...WarriorTypes.pawn });
    });
  });
});
