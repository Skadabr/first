import React from "react";

const EMPTY_DATA = {
  email: "",
  password: "",
  name: ""
};
const EMPTY = {};

interface PropTypes {
  submit: any;
}

interface StateTypes {
  data: any;
  errors: any;
}

export default class SignupForm extends React.Component<PropTypes, StateTypes> {
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

    const resp = await this.props.submit(this.state.data);
    if (resp.error) {
      this.setState({
        data: EMPTY_DATA,
        errors: {
          server: e.message
        }
      });
      return
    }
    this.setState({
      data: EMPTY_DATA,
      errors: EMPTY
    });
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
          <form id="signup" onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="signup_email">Email:</label>
              <input
                id="signup_email"
                className="form-control"
                name="email"
                type="email"
                onChange={this.onChange}
                value={data.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup_name">Name:</label>
              <input
                id="signup_name"
                className="form-control"
                name="name"
                type="text"
                onChange={this.onChange}
                value={data.name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup_password">Password:</label>
              <input
                className="form-control"
                id="signup_password"
                name="password"
                type="password"
                onChange={this.onChange}
                value={data.password}
              />
            </div>
            <div className="form-group">
              <button
                id="signup_submit_btn"
                className="btn btn-block btn-primary"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function validate({ email, name, password }) {
  const errors: { password?: string } = {};

  if (password.length < 8) errors.password = "Password too short";

  return errors;
}
