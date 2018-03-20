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

export const getPlayerByUserId = (state, user_id) =>
  getPlayers(state).find(p => p.user._id === user_id);

export const getPlayer = state => getPlayerByUserId(state, state.user._id);

export const getOpponent = state =>
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
  const hero = state.units.find(u => u.hero && u.owner_id === state.user._id);
};

export const getOpponentHero = state => {
  const hero = state.units.find(u => u.hero && u.owner_id === state.user._id);
};

//
// ============ hand/card ============

export const getPlayerHand = state => getPlayer(state).hand;

export const getOpponentHand = state => getOpponent(state).hand;

export const getCards = state =>
  getPlayers(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const getCard = (state, id) => getCards(state).find(c => c._id === id);

//
// ============ units ============

export const getUnits = state => state.units;

export const getUnitById = (state, id) => {
  const unit = getUnits(state).find(({ _id }) => _id === id);
  return unit;
};

export const getUnitsByUserId = (state, user_id) => {
  const units = getUnits(state).filter(u => u.owner_id === user_id);
  return units;
};

export const getPlayerUnits = state => getUnitsByUserId(state, state.user._id);
export const getPlayerUnitIds = state =>
  getPlayerUnits(state).map(({ _id }) => _id);

export const getOpponentUnits = state => {
  const users = getUnits(state).filter(({ _id }) => _id !== state.user._id);
  return users;
};

export const getOpponentUnitIds = state =>
  getOpponentUnits(state).map(({ _id }) => _id);


export const getUnitFriends = (state, unit_id) => {
  const unitOwnerId = getUnitById(state, unit_id).owner_id;
  return getUnitsByUserId(state, unitOwnerId).filter(
    unit => unit._id !== unit_id
  );
};

export const getUnitFriendIds = (state, unit_id) =>
  getUnitFriends(state, unit_id).map(unit => unit._id);
export const isUnitFriend = (state, { unit_id, target_id }) =>
  getUnitFriendIds(state, unit_id).includes(target_id);

export const isUnitHasEffect = (state, unit_id, effect_type) =>
  getUnitById(state, unit_id)
    .effects.map(eff => eff.type)
    .includes(effect_type);

//
// ============
//

export function getAllAvailableForAttackTargetIds(state, source_id) {
  const targetIds = getOpponentUnitIds(state);

  return targetIds.filter(target_id =>
    isTargetAvailableForAttack(state, source_id, target_id)
  );

  function isTargetAvailableForAttack(state, source_id, target_id) {
    const target = getUnitById(state, target_id);
    const effects = getAllAvailabilityEffects(state, source_id, target_id);
    const rawTarget = applyEffects(effects, target, state);
    return isUnitAvailable(rawTarget);
  }
}

export function isTargetAvailableForAttack(state, source_id, target_id) {
  return getAllAvailableForAttackTargetIds(state, source_id).includes(
    target_id
  );
}

export function getRawUnitSource(state, source_id, target_id) {
  const source = getUnitById(state, source_id);

  const effects = getAllAttackingEffects(state, source_id, target_id);
  const rawSource = applyEffects(effects, source, state);

  return rawSource;
}

export function getDeadOpponentUnits(state) {
  const targetIds = getOpponentUnits(state);

  return targetIds.filter(target => isTargetDead(target._id));

  function isTargetDead(target_id) {
    const target = getUnitById(state, target_id);
    const effects = getAllSelectionEffects(state, target_id);
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
