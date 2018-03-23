export const getBattle = state => state.battle;
export const getPlayers = state => state.battle.players;
export const isBattleStarted = state => getBattle(state).players.length > 0;

//
// ============ player ============
//

export const getPlayerByUserId = (state, userId) =>
  getPlayers(state).find(p => p.user._id === userId);

export const getPlayer = state => getPlayerByUserId(state, state.user._id);

export const getEnemy = state =>
  getPlayers(state).find(p => p.user._id !== state.user._id);

//
// ============ turn ============
//

export const getTurnOwnerId = state => getBattle(state).turnOwner;

export const isPlayerTurnOwner = state => {
  const turnOwner = getTurnOwnerId(state);
  const _id = state.user._id;
  return turnOwner === _id;
};

export const getNextTurnOwnerPlayer = state => {
  const battle = getBattle(state);
  return battle.players.find(p => p.user._id !== battle.turnOwner);
};

//
// ============ hand/card ============
//

export const getPlayerHand = state => getPlayer(state).hand;

export const getEnemyHand = state => getEnemy(state).hand;

export const getCards = state =>
  getPlayers(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const getCard = (state, id) => getCards(state).find(c => c._id === id);

//
// ============
//

function isUnitDead(target) {
  return target.health <= 0;
}
