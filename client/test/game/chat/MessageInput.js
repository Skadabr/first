import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import MessageInput from "../../../src/components/game/chat/MessageInput";

describe("<MessageInput />", function() {
  context("when message input is empty", function() {
    beforeEach(function() {
      this.submit = sinon.spy();
      this.input = shallow(<MessageInput submit={this.submit} />);
    });

    it("do not submit data", function() {
      //this.input.find('form input[type="text"]').emit
      this.input.find("form button").simulate("click");
      expect(this.submit.calledOnce).to.be.false;
    });
  });

  context("when message input is not empty", function() {
    beforeEach(function() {
      this.submit = sinon.spy();
      this.input = shallow(<MessageInput submit={this.submit} />);
      this.input
        .find('form input[type="text"]')
        .simulate("change", { target: { name: "message", value: "some text" } });
    });

    it("submit data", function() {
      this.input.find("form").simulate("submit", { preventDefault() {} });
      sinon.assert.calledOnce(this.submit);
    });
  });
});
