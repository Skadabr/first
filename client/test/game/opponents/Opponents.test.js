import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import OpponentsHeader from "../../../src/components/game/opponents/OpponentsHeader";
import { Opponents } from "../../../src/components/game/opponents/Opponents";

describe("<Opponents />", function() {
  context("when change status from PEACE", function() {
    beforeEach(function() {
      const user = {
        name: "Oleg",
        email: "oleg@mail.com",
        status: "PEACE"
      };
      const opponents = [
        {
          name: "Some",
          status: "PEACE"
        },
        {
          name: "John",
          status: "PEACE"
        }
      ];

      this.readyToFight = sinon.spy();
      this.opponents = shallow(
        <Opponents
          user={user}
          opponents={opponents}
          readyToFight={this.readyToFight}
        />
      );
      this.opponents
        .find(OpponentsHeader)
        .dive()
        .find("#user_status_badge")
        .simulate("click");
    });

    it("readyToFight is called", function() {
      sinon.assert.calledOnce(this.readyToFight);
    });
  });
});
