import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import WarriorTypes from "../../../src/warrior_types";
import { BattleField } from "../../../src/components/game/board/BattleField";

const ME = {
  name: "Oleg",
  health: 30,
  warriors: [
    {
      ...WarriorTypes.pawn,
      position: 4
    }
  ]
};

const OPPONENT = {
  name: "Jack",
  health: 30,
  warriors: [
    {
      ...WarriorTypes.officer,
      position: 4
    }
  ]
};

describe("<BattleField />", function() {
  it("show opponent in correct positions", function() {
    this.field = shallow(<BattleField game={{ ME, OPPONENT }} />);
    expect(
      this.field
        .find("#my_warriors_positions")
        .children()
        .at(4)
        .children()
        .at(0)
        .text()
    ).to.be.equal("pawn");
    expect(
      this.field
        .find("#opponent_warriors_positions")
        .children()
        .at(4)
        .children()
        .at(0)
        .text()
    ).to.be.equal("officer");
  });
});
