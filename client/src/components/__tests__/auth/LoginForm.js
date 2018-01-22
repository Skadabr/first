import React from "react";
import { shallow } from "enzyme";

import LoginForm from "../../auth/LoginForm";

describe("<LoginForm />", function() {
  describe("when data is valid", function() {
    let login, submit;

    beforeEach(function() {
      submit = jest.fn();
      login = shallow(<LoginForm submit={submit} />);

      login.find('form input[name="email"]').simulate("change", {
        target: { value: "acc@mail.com", name: "email" }
      });
      login.find('form input[name="password"]').simulate("change", {
        target: { name: "password", value: "deadbeef" }
      });
      login.find("form").simulate("submit", { preventDefault() {} });
    });

    it("submit data", function() {
      expect(submit.mock.calls).toHaveLength(1);
      expect(submit.mock.calls[0][0]).toEqual({email: "acc@mail.com", password: "deadbeef"});
    });
  });

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
    beforeEach(function(done) {
      submit = jest
        .fn()
        //.mockReturnValue(Promise.reject(new Error("Email/Password is wrong")));
        .mockImplementation(async () => {
          throw new Error("Email/Password is wrong");
        });

      login = shallow(<LoginForm submit={submit} />);

      const loginInstance = login.instance();
      const onSubmit = loginInstance.onSubmit;
      loginInstance.onSubmit = (...args) =>
        onSubmit.call(loginInstance, ...args).then(() => {
          login.update();
          done();
        });

      login.find("#login_email").simulate("change", {
        target: { value: "acc@mail.com", name: "email" }
      });
      login.find("#login_password").simulate("change", {
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
