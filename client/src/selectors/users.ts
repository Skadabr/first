import { createSelector } from "reselect";

export const otherUsersSelector = createSelector(
  state => state.users,
  state => state.user.name,
  (ops, user_name) => {
    return ops.filter(op => op.name !== user_name);
  }
);
