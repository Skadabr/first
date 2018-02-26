import React from "react";
import { connect } from "react-redux";

import StatusBadge from "./StatusBadge";
import OpponentsList from "./OpponentsList";
import UserInfo from "./UserInfo";

import { readyToFight } from "../../actions/dashboard";
import { otherUsersSelector } from "../../selectors/users";
import { userInfoSelector } from "../../selectors/user";
import { UserStatusType } from "../../constants";

interface PropTypes {
  user: {
    email: string;
    name: string;
    status: UserStatusType;
    rate: number;
  };
  opponents: { name; status }[];
  readyToFight: Function;
  history: any;
}

export class Dashboard extends React.Component<PropTypes> {
  toggle = ev => {
    const { readyToFight, user, history } = this.props;

    switch (user.status) {
      case UserStatusType.Peace:
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
          <span>Opponents</span>
          <StatusBadge toggle={this.toggle} user_status={user.status} />
        </div>
        <div className="card-body">
          <OpponentsList opponents={opponents} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: userInfoSelector(state),
    opponents: otherUsersSelector(state)
  };
}

export default connect(mapStateToProps, {
  readyToFight
})(Dashboard as any);
