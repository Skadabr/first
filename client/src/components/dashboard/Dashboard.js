import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import OpponentsHeader from "./OpponentsHeader";
import OpponentsList from "./OpponentsList";
import UserInfo from "./UserInfo";

import { readyToFight } from "../../actions/dashboard";
import { opponentsSelector } from "../../selectors/opponents";
import { userInfoSelector } from "../../selectors/user";
import { PEACE, READY, FIGHT } from "../../constants";

export class Dashboard extends React.Component {
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
        <div id="user_name" className="card-header">
          {user.name}
        </div>
        <div id="user_email" className="card-body">
          <UserInfo {...user} />
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

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  }).isRequired,
  opponents: PropTypes.arrayOf(PropTypes.object),
  readyToFight: PropTypes.func
};

function mapStateToProps(state) {
  return {
    user: userInfoSelector(state),
    opponents: opponentsSelector(state),
  }
}

export default connect(mapStateToProps, {
  readyToFight
})(Dashboard);
