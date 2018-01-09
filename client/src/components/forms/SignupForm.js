import React from "react";
import PropTypes from "prop-types";

const EMPTY_DATA = {
  email: "",
  password: "",
  name: ""
};
const EMPTY = {};

export default class SignupForm extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  state = {
    data: EMPTY_DATA,
    errors: EMPTY
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState(prev => ({ data: { ...prev.data, [name]: value } }));
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.submit(this.state.data);
  };

  render() {
    return (
      <div className="card">
        <div className="card-header">Sign up</div>
        <div className="card-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="signup_email">Email:</label>
              <input
                id="signup_email"
                name="email"
                type="email"
                onChange={this.onChange}
                value={this.state.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup_name">Name:</label>
              <input
                id="signup_name"
                name="name"
                type="text"
                onChange={this.onChange}
                value={this.state.name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup_password">Password:</label>
              <input
                id="signup_password"
                name="password"
                type="password"
                onChange={this.onChange}
                value={this.state.password}
              />
            </div>
            <div>
              <button>Signup</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
