class BattleBuilder {
  private state: {
    user: {
      _id: string;
    };
    battle: {
      turnOwner: string;
      players: any[];
      units: any[];
    };
  };

  constructor(userId) {
    this.state = {
      user: { _id: userId },
      battle: {
        turnOwner: "",
        players: [
          {
            user: { _id: userId }
          }
        ],
        units: []
      }
    };
  }

  addEnemy(enemyId) {
    if (this.state.battle.players.length > 1) {
      throw Error("Enemy was already added");
    }

    this.state.battle.players.push({
      user: { _id: enemyId }
    });
  }
}
