import React from "react";
import { shallow } from "enzyme";

import LoginForm from "../../auth/LoginForm";

describe("<LoginForm />", function() {
  describe("when input invalid password", function() {
    let login, submit;
    beforeEach(function() {
      submit = jest.fn();
      login = shallow(<LoginForm submit={submit} />);
      //login.find("form #login_email").instance().value = "acc@mail.com";
      //login.find("form #login_password").instance().value = "short";

      login.find("#login_email").simulate("change", {
        target: { value: "acc@mail.com", name: "email" }
      });
      login
        .find("#login_password")
        .simulate("change", { target: { value: "short", name: "password" } });
      login.find("form").simulate("submit", { preventDefault() {} });
    });

    it("show validation error about short password", function() {
      expect(login.find("#login_validation_errors")).toHaveLength(1);
      expect(
        login
          .find("#login_validation_errors .list-group-item-danger")
          .at(0)
          .text()
      ).toBe("Password too short");
    });
  });

  describe("when server return authentication failure", function() {
    let login, submit;
    beforeEach(function() {
      submit = jest
        .fn()
        //.mockReturnValue(Promise.reject(new Error("Email/Password is wrong")));
        .mockImplementation(() => {
          throw new Error("Email/Password is wrong");
        });

      login = shallow(<LoginForm submit={submit} />);

      login.find("#login_email").simulate("change", {
        target: { value: "acc@mail.com", name: "email" }
      });
      login
        .find("#login_password")
        .simulate("change", {
          target: { value: "deadbeaf", name: "password" }
        });
      login.find("form").simulate("submit", { preventDefault() {} });
    });

    it("show validation error about wrong email/password", function() {
      expect(
        login
          .find("#login_validation_errors .list-group-item-danger")
          .at(0)
          .text()
      ).toBe("Email/Password is wrong");
    });
  });
});
