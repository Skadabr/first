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
      <form onSubmit={this.onSubmit} style={{display: "flex", flexDirection: "row"}}>
          <input
            id="chat_message_input"
            className="form-control mr-0"
            name="message"
            type="text"
            autoComplete="off"
            value={message}
            onChange={this.onChange}
          />
          <button id="btn-chat" className="btn btn-secondary">
            Send
          </button>
      </form>
    );
  }
}

//MessageInput.propTypes = {
//  submit: PropTypes.func.isRequired
//};
