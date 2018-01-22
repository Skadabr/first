import React from "react";
import { shallow } from "enzyme";

import { Header } from "../Header";

describe("<Header />", function() {
  let logout;

  beforeEach(() => {
    logout = jest.fn();
  });

  describe("is logged in", function() {
    it("shows 2 buttons", function() {
      const header = shallow(<Header isAuthenticated={true} logout={logout} />);
      expect(header.find("li.nav-item")).toHaveLength(2);
    });
  });
});
