import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import RootPage from "../../src/components/pages/RootPage";
import Auth from "../../src/components/auth/Auth";

describe("<RootPage />", function() {
  it("render Auth", function() {
    const root = shallow(<RootPage />);
    expect(root.find(Auth).length).to.equal(1);
  });
});
