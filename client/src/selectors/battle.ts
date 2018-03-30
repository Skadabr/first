import { getUserInfo } from "./user";

export const getBattle = state => state.battle;
export const getPlayers = state => state.battle.players;
export const isBattleStarted = state => getBattle(state).players.length > 0;

export const getPlayer = state =>
  getPlayerByUserId(state, getUserInfo(state)._id);

export const getEnemy = state =>
  getPlayers(state).find(p => p.user._id !== getUserInfo(state)._id);

export const getAvailableTargets = state => state.availableTargets;

export const getPlayerHand = state => getPlayer(state).hand;

export const getEnemyHand = state => getEnemy(state).hand;

export const getPlayerHero = state =>
  getHeroByUserId(state, getUserInfo(state)._id);

export const getEnemyHero = state =>
  getEnemyHeroByUserId(state, getUserInfo(state)._id);

export const getPlayerMinions = state =>
  getMinionsByUserId(state, getUserInfo(state)._id);

export const getEnemyMinions = state =>
  getEnemyMinionsByUserId(state, getUserInfo(state)._id);

export const isPlayerTurnOwner = state => {
  const turnOwner = getTurnOwnerId(state);
  const _id = state.user._id;
  return turnOwner === _id;
};

//
//
// =====================
//
//

export const getPlayerByUserId = (state, userId) =>
  getPlayers(state).find(p => p.user._id === userId);

export const getCards = state =>
  getPlayers(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const getTurnOwnerId = state => getBattle(state).turnOwner;

export const getUnits = state => state.battle.units;

//////////////////////////////////////////////////////////////////

export const getUnitsByUserId = (state, userId) => {
  const units: any[] = getUnits(state).filter(u => u.ownerId === userId);
  return units;
};

export const getMinionsByUserId = (state, userId) => {
  const minions: any[] = getUnitsByUserId(state, userId).filter(
    ({ hero }) => !hero
  );
  return minions;
};

export const getHero = (state, userId) => {
  const hero: any[] = getUnitsByUserId(state, userId).filter(
    ({ hero }) => hero
  );
  if (hero.length > 1) throw Error("There should be only one hero");
  return hero[0];
};

export const getEnemyUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId !== userId);
  return units;
};

export const getEnemyMinionsByUserId = (state, userId): any[] => {
  const minions: any[] = getEnemyUnitsByUserId(state, userId).filter(
    ({ hero }) => !hero
  );
  return minions;
};

export const getHeroByUserId = (state, userId) => {
  const hero: any[] = getUnitsByUserId(state, userId).filter(
    ({ hero }) => hero
  );
  if (hero.length > 1) throw Error("There should be only one hero");
  return hero[0];
};

export const getEnemyHeroByUserId = (state, userId) => {
  const hero: any[] = getEnemyUnitsByUserId(state, userId).filter(
    ({ hero }) => hero
  );
  if (hero.length > 1) throw Error("There should be only one hero");
  return hero[0];
};
