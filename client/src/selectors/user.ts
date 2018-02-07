import { createSelector } from "reselect";

import { UserState } from "../actions/user";

export const userInfoSelector = createSelector<UserState, >(
  state => state.user,
  ({ name, status, email, rate }) => ({ name, status, email, rate })
);

export const isAuthenticatedSelector = createSelector(
  state => state.user,
  ({ token }) => !!token
);
