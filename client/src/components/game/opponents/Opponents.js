import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import OpponentsHeader from "./OpponentsHeader";
import OpponentsList from "./OpponentsList";

import { readyToFight } from "../../../state/user.state";
import { PEACE, READY, FIGHT } from "../../../state/user.state";

export class Opponents extends React.Component {
  toggle = ev => {
    const { readyToFight, user } = this.props;

    switch (user.status) {
      case PEACE:
        return readyToFight();
    }
  };

  render() {
    const { opponents, readyToFight, user } = this.props;

    return (
      <div className="card">
        <div id="user_name" className="card-header">{user.name}</div>
        <div id="user_email" className="card-body">
          <div className="card-block">Email: {user.email}</div>
        </div>
        <div id="user_money" className="card-body">
          <div className="card-block">Money: {user.money}</div>
        </div>
        <div className="card-header">
          <OpponentsHeader toggle={this.toggle} user_status={user.status} />
        </div>
        <div className="card-body">
          <OpponentsList opponents={opponents} />
        </div>
      </div>
    );
  }
}

Opponents.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  opponents: PropTypes.arrayOf(PropTypes.object),
  readyToFight: PropTypes.func
};

function mapStateToProps(state) {
  return {
    user: state.user,
    opponents: state.opponents.filter(op => op.name !== state.user.name)
  };
}

export default connect(mapStateToProps, {
  readyToFight
})(Opponents);
