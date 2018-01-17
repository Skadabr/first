import PropTypes from "prop-types";
import React from "react";

const EMPTY_DATA = {
  email: "",
  password: ""
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

  onSubmit = async e => {
    e.preventDefault();
    const { data } = this.state;
    const errors = validate(data);

    if (Object.keys(errors).length) {
      return this.setState({ errors });
    }

    try {
      await this.props.submit(this.state.data);
    } catch (e) {
      this.setState({
        data: EMPTY_DATA,
        errors: {
          server: e.message
        }
      });
    }
  };

  render() {
    const { errors, data } = this.state;
    const errKeys = Object.keys(errors);

    return (
      <div className="card">
        <div className="card-header">Sign up</div>
        <div className="card-body">
          {errKeys.length > 0 && (
            <div className="list-group">
              {errKeys.map(key => (
                <div
                  key={key}
                  className="list-group-item list-group-item-danger"
                >
                  {errors[key]}
                </div>
              ))}
            </div>
          )}
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="login_email">Email:</label>
              <input
                id="login_email"
                name="email"
                type="email"
                onChange={this.onChange}
                value={data.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login_password">Password:</label>
              <input
                id="login_password"
                name="password"
                type="password"
                onChange={this.onChange}
                value={data.password}
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

function validate({ email, name, password }) {
  const errors = {};

  if (password.length < 8) errors.password = "Password too short";

  return errors;
}
