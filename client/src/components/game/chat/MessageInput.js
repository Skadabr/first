import React from "react";
import PropTypes from "prop-types";

export default function MessageInput({ submit }) {
  let input;

  return (
    <form className="form-inline" onSubmit={onSubmit}>
      <div className="form-group">
        <input
          className="form-control"
          type="text"
          autoComplete="off"
          ref={el => (input = el)}
        />
      </div>
      <div className="form-group">
        <button className="btn">Send</button>
      </div>
    </form>
  );

  function onSubmit(ev) {
    ev.preventDefault();
    const value = input.value;
    if (value === "") return;
    input.value = "";
    submit(value);
  }
}

MessageInput.propTypes = {
  submit: PropTypes.func.isRequired
};
