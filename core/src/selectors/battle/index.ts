import { applyEffects } from "../../unit/index";
import {
  getAllAvailabilityEffects,
  getAllAttackingEffects,
  getAllSelectionEffects
} from "./effects";

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
// ============ hero ============

export const getPlayerHero = state => {
  const hero = state.units.find(u => u.hero && u.ownerId === state.user._id);
};

export const getEnemyHero = state => {
  const hero = state.units.find(u => u.hero && u.ownerId === state.user._id);
};

//
// ============ hand/card ============

export const getPlayerHand = state => getPlayer(state).hand;

export const getEnemyHand = state => getEnemy(state).hand;

export const getCards = state =>
  getPlayers(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const getCard = (state, id) => getCards(state).find(c => c._id === id);


//
// ============
//

export function getRawUnitSource(state, sourceId, targetId) {
  const source = getUnitById(state, sourceId);

  const effects = getAllAttackingEffects(state, sourceId, targetId);
  const rawSource = applyEffects(effects, source, state);

  return rawSource;
}

export function getDeadEnemyUnits(state) {
  const targetIds = getEnemyUnits(state);

  return targetIds.filter(target => isTargetDead(target._id));

  function isTargetDead(targetId) {
    const target = getUnitById(state, targetId);
    const effects = getAllSelectionEffects(state, targetId);
    const rawTarget = applyEffects(effects, target, state);
    return isUnitDead(rawTarget);
  }
}

function isUnitAvailable(target) {
  return target.availability > 0;
}

function isUnitDead(target) {
  return target.health <= 0;
}
