import { createSelector } from "reselect";

export const userInfoSelector = createSelector(
  state => state.user,
  ({ name, status, email, rate }) => ({ name, status, email, rate })
);

export const isAuthenticatedSelector = createSelector(
  state => state.user,
  ({ token }) => !!token
);
