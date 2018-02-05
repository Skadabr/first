import PropTypes from "prop-types";

export const WarriorType = PropTypes.shape({
  type: PropTypes.oneOf(["officer", "pawn"]).isRequired,
  health: PropTypes.number.isRequired,
  damage: PropTypes.number.isRequired,
  position: PropTypes.number // ??? weather warrior should care about his position ?
});

//export const GamerType = PropTypes.shape({
//  name: PropTypes.string.isRequired,
//  health: PropTypes.number.isRequired,
//  last_warrior: WarriorType,
//  warriors: PropTypes.arrayOf(PropTypes.shape(WarriorType)).isRequired
//})
//
//export const GameType = PropTypes.shape({
//  turn: PropTypes.bool.isRequired,
//});
//
