import React from "react";
import { shallow } from "enzyme";

import RootPage from "../../pages/RootPage";
import Auth from "../../auth/Auth";

describe("<RootPage />", function() {
  it("render Auth", function() {
    const root = shallow(<RootPage />);
    expect(root.find(Auth)).toHaveLength(1);
  });
});
