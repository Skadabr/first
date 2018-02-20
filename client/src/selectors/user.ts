import { createSelector } from "reselect";

import { UserStatusType } from "../constants";
import { State } from "../reducer";
import { UserState } from "../actions/user";

export const userInfoSelector = createSelector(
  state => state.user,
  ({ name, status, email, rate }) => ({ name, status, email, rate })
);

export const isAuthenticatedSelector = createSelector(
  state => state.user,
  ({ token }) => !!token
);
