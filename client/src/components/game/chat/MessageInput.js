import React from "react";
import PropTypes from "prop-types";

const EMPTY = {message: ""}

export default class MessageInput extends React.Component {
  state = EMPTY ;

  onChange = e => {
    const target = e.target;
    this.setState(prev => ({ message: prev.message + e.value }));
  };

  onSubmit = ev => {
    ev.preventDefault();
    const value = this.state.message;
    if (value === "") return;
    this.setState(EMPTY);
    this.props.submit(value);
  };

  render() {
    const { submit } = this.props;
    const { message } = this.state;

    return (
      <form className="form-inline" onSubmit={this.onSubmit}>
        <div className="input-group">
          <input
            className="form-control input-sm"
            name="message"
            type="text"
            autoComplete="off"
            value={message}
            onChange={this.onChange}
          />
        </div>
        <div className="input-group-btn">
          <button id="btn-chat" className="btn btn-sm">
            Send
          </button>
        </div>
      </form>
    );
  }
}

MessageInput.propTypes = {
  submit: PropTypes.func.isRequired
};
