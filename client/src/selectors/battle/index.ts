export const getBattle = state => state.battle;
export const getPlayers = state => state.battle.players;

export const isBattleStarted = state => getBattle(state).players.length > 0;

//
// ============ player ============

export const getPlayerByUserId = (state, user_id) =>
  getPlayers(state).find(p => p.user._id === user_id);

export const getPlayer = state => getPlayerByUserId(state, state.user._id);

export const getOpponent = state =>
  getPlayers(state).find(p => p.user._id !== state.user._id);

//
// ============ turn ============

export const isTurnOwner = state => {
  const battle = getBattle(state);
  const _id = state.user._id;
  return battle.turnOwner === _id;
};

export const getNextTurnOwnerPlayer = state => {
  const battle = getBattle(state);
  return battle.players.find(p => p.user._id !== battle.turnOwner);
};

//
// ============ hero ============

export const getPlayerHero = state => getPlayer(state).hero;

export const getOpponentHero = state => getOpponent(state).hero;

//
// ============ hand/card ============

export const getPlayerHand = state => getPlayer(state).hand;

export const getOpponentHand = state => getOpponent(state).hand;

export const getCards = state =>
  getPlayers(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const getCard = (state, id) => getCards(state).find(c => c._id === id);

//
// ============ units ============

export const getUnits = state =>
  getPlayers(state).reduce((units, p) => [...units, ...p.units]);

export const getUnitsByUserId = (state, user_id) =>
  getPlayerByUserId(state, user_id).units;

export const getPlayerUnits = state => getPlayer(state).units;

export const getOpponentUnits = state => getOpponent(state).units;

export const getUnit = (state, id) =>
  getUnits(state).find(unit => unit._id === id);

export const getUnitFriends = (state, unit_id) => {
  const unitOwnerId = getUnit(state, unit_id).owner_id;
  return getUnitsByUserId(state, unitOwnerId);
};
