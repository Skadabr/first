import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import OpponentsHeader from "../../../src/components/game/opponents/OpponentsHeader";

describe("<OpponentsHeader />", function() {
  ["peace", "fight", "ready"].forEach(function(status) {
    describe("when user status is " + status, function() {
      beforeEach(function() {
        this.header = shallow(
          <OpponentsHeader user_status={status} toggle={() => {}} />
        );
      });

      it("renders peace badge", function() {
        expect(this.header.find("#user_status_badge").text()).to.be.equal(
          status
        );
      });
    });
  });

  describe("when click on badger", function() {
    beforeEach(function() {
      this.toggle = sinon.spy();
      this.header = shallow(
        <OpponentsHeader user_status="peace" toggle={this.toggle} />
      );
      this.header.find("#user_status_badge").simulate("click")
    });

    it("call toggle", function () {
      sinon.assert.calledOnce(this.toggle);
    })
  });
});
