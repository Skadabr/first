import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import OpponentsHeader from "./OpponentsHeader";
import OpponentsList from "./OpponentsList";

import { beNonActive, beActive } from "../../state/user.state";

class Opponents extends React.Component {
  toggle = () => {
    const { beActive, beNonActive, active, name } = this.props;
    active ? beNonActive(name) : beActive(name);
  }

  render() {
    const { active, opponents } = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <OpponentsHeader toggle={this.toggle} active={active} />
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
    name: state.user.name,
    active: state.user.active,
    opponents: state.opponents
  };
}

export default connect(mapStateToProps, {
  beActive,
  beNonActive,
})(Opponents);
