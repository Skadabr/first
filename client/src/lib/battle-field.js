export default class BattleField {
  constructor(fst_name, snd_name) {
    this.last_turn = snd_name;
    this.fst = {
      name: fst_name,
      warriors: []
    };
    this.snd = {
      name: snd_name,
      warriors: []
    };
  }

  add(name, warrior) {
    if (this.last_turn === name) throw new Error("It's not your turn");
    this[name].warriors.push(warrior);
  }

  turn(name) {
    if (this.last_turn === name) throw new Error("It's not your turn");
    this.last_turn = name;
  }
}
