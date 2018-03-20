import { EffectScope, EffectImpact } from "../../index";
import { getUnitById, getUnits, getPlayerUnits, getOpponentUnits } from "./index";

//
// ============ general effects selectors ============
//

export const getAllEffects = (state, owner_id) => {
  const unit = getUnits(state).filter(
    unit => owner_id === undefined || unit.owner_id === owner_id
  );
  const effects = unit.reduce(
    (effects, unit) => [...effects, ...unit.effects],
    []
  );
  return effects;
};

export const getEffects = (state, unit_id) => getUnitById(state, unit_id).effects;

export const getFilteredEffects = (
  state,
  {
    scope,
    impact,
    unit_id,
    owner_id
  }: { scope?: number; impact?: number; unit_id?: string; owner_id?: string }
) => {
  const effects = unit_id
    ? getEffects(state, unit_id)
    : getAllEffects(state, owner_id);

  return effects.filter(
    eff => effectInScope(scope, eff) && effectHasImpact(impact, eff)
  );
};

//
// ============
//

export const getAllAvailabilityEffects = (state, source_id, target_id) => {
  const global = getFilteredEffects(state, {
    scope: EffectScope.Global,
    impact: EffectImpact.Availability
  });
  const source = getFilteredEffects(state, {
    scope: EffectScope.Local,
    impact: EffectImpact.Availability,
    unit_id: source_id
  });
  const target = getFilteredEffects(state, {
    scope: EffectScope.Local,
    impact: EffectImpact.Availability,
    unit_id: target_id
  });

  const effects = [...global, ...source, ...target];

  return effects.sort((a, b) => a.priority - b.priority);
};

export const getAllAttackingEffects = (state, source_id, target_id) => {
  const globalAttackEffects = getFilteredEffects(state, {
    scope: EffectScope.Global,
    impact: EffectImpact.Attack
  });
  const globalDefenseEffects = getFilteredEffects(state, {
    scope: EffectScope.Global,
    impact: EffectImpact.Defend
  });

  const sourceAttackEffects = getFilteredEffects(state, {
    scope: EffectScope.Local,
    impact: EffectImpact.Attack,
    unit_id: source_id
  });
  const targetDefenseEffects = getFilteredEffects(state, {
    scope: EffectScope.Local,
    impact: EffectImpact.Defend,
    unit_id: target_id
  });

  const effects = [
    ...globalAttackEffects,
    ...globalDefenseEffects,
    ...sourceAttackEffects,
    ...targetDefenseEffects
  ];

  return effects.sort((a, b) => a.priority - b.priority);
};

export const getAllSelectionEffects = (state, unit_id) => {
  const global = getFilteredEffects(state, {
    scope: EffectScope.Global,
    impact: EffectImpact.Selection
  });

  const local = getFilteredEffects(state, {
    scope: EffectScope.Local,
    impact: EffectImpact.Selection,
    unit_id
  });

  const effects = [...global, ...local];

  return effects.sort((a, b) => a.priority - b.priority);
};

//
// ============ helpers ============
//

function effectInScope(scope, eff) {
  return scope === undefined || eff.scope === scope;
}

function effectHasImpact(impact, eff) {
  return (
    impact === undefined ||
    (eff.impact !== undefined && eff.impact === impact) ||
    (Array.isArray(eff.impacts) && eff.impacts.includes(impact))
  );
}
