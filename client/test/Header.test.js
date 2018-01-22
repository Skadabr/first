import React from "react";
import { expect }from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import { Header } from "../src/components/Header";

describe("<Header />", function() {
  let logout;

  beforeEach(() => {
    logout = sinon.spy();
  });

  describe("is logged in", function() {
    it("shows 2 buttons", function() {
      const header = shallow(<Header isAuthenticated={true} logout={logout} />);
      expect(header.find("li.nav-item").length).to.be.equal(2);
    });
  });
});
