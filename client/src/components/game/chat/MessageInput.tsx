import * as React from "react"

const EMPTY = { message: "" };

interface PropTypes {
  submit: Function;
}

export default class MessageInput extends React.Component<PropTypes> {
  state = EMPTY;

  onChange = e => {
    const target = e.target;
    this.setState({ message: target.value });
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
            id="chat_message_input"
            className="form-control input-sm"
            name="message"
            type="text"
            autoComplete="off"
            value={message}
            onChange={this.onChange}
          />
        </div>
        <div className="input-group-btn">
          <button id="btn-chat" className="btn btn-secondary">
            Send
          </button>
        </div>
      </form>
    );
  }
}

//MessageInput.propTypes = {
//  submit: PropTypes.func.isRequired
//};
