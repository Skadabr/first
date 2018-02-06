import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//import { GamerType } from "../types";

export class BattleField extends React.Component {
  //static propTypes = {
  //  me: GamerType,
  //  opponent: GamerType
  //};

  render() {
    const {
      my_gamer,
      opponent_gamer,
      my_warriors,
      opponent_warriors,
      warriorsAdd
    } = this.props;
    //  const myWarriors = me.warriors;
    //  const opponentWarriors = opponent.warriors;

    return (
      <div id="battle_field" className="card">
      </div>
    );
    //      <div
    //        id="opponent_warriors_positions"
    //        className="card-block"
    //        style={{ display: "flex", flexDirection: "row" }}
    //      >
    //        {[...getWarriorLogos(opponentWarriors)]}
    //      </div>
  }
}

function mapStateToProps(state) {
  return {
    my_gamer: myGamerSelector(state),
    opponent_gamer: opponentGamerSelector(state),
    my_warriors: myWarriorsSelector(state),
    opponent_warriors: opponentWarriorsSelector(state)
  };
}

export default connect(mapStateToProps, { warriorsAdd })(BattleField);
