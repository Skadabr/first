import PropTypes from "prop-types";
import React from "react";

const EMPTY_DATA = {
  email: "",
  password: "",
};
const EMPTY = {};

export default class LoginForm extends React.Component {
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
              <label htmlFor="login_email">Email:</label>
              <input
                id="login_email"
                name="email"
                type="email"
                onChange={this.onChange}
                value={this.state.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login_password">Password:</label>
              <input
                id="login_password"
                name="password"
                type="password"
                onChange={this.onChange}
                value={this.state.password}
              />
            </div>
            <div>
              <button>Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
