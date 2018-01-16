import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import OpponentsHeader from "./OpponentsHeader";
import OpponentsList from "./OpponentsList";

import { readyToFight } from "../../state/user.state";
import { PEACE, READY, FIGHT } from "../../state/user.state";


class Opponents extends React.Component {
  toggle = ev => {
    const { readyToFight, user_status } = this.props;

    switch (user_status) {
      case PEACE:
        return readyToFight();
    }
  };

  render() {
    const { opponents, readyToFight, user_status } = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <OpponentsHeader toggle={this.toggle} user_status={user_status} />
        </div>
        <div className="card-body">
          <OpponentsList opponents={opponents} />
        </div>
      </div>
    );
  }
}

Opponents.propTypes = {
  user_status: PropTypes.string.isRequired,
  opponents: PropTypes.arrayOf(PropTypes.object),
  readyToFight: PropTypes.func
}

function mapStateToProps(state) {
  return {
    user_status: state.user.status,
    opponents: state.opponents.filter(op => op.name !== state.user.name)
  };
}

export default connect(mapStateToProps, {
  readyToFight
})(Opponents);
