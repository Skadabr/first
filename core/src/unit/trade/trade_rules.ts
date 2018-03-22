const tradingRules = [
  {
    sourceFeatures: [],
    targetFeatures: ["SHIELD"],
    action(state, sourceId, targetId) {
      targetId.features = targetId.features.filter(f => f !== "SHIELD");
      return targetId;
    }
  },
  {
    sourceFeatures: ["POISON"],
    targetFeatures: ["SHIELD"],
    action(state, sourceId, targetId) {
      targetId.features = targetId.features.filter(f => f !== "SHIELD");
      return targetId;
    }
  },
  {
    sourceFeatures: ["POISON"],
    targetFeatures: [],
    action(state, sourceId, targetId) {
      targetId.health = 0;
      return targetId;
    }
  }
];
