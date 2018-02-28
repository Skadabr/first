export const getOtherUsers = state =>
  state.users.filter(op => op.name !== state.user.name);

