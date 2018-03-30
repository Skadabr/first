export function handleBattleEvent(dispatch) {
  return ev => {
    // TODO: eliminate direct relation between `redux actions` and `battle events`
    dispatch(ev);
  };
}


export function handleBattleError(dispatch) {
  return err => {
    // TODO: rewrite this stub
    console.error(err.message);
  };
}


