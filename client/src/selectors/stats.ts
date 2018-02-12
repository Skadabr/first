import { createSelector } from "reselect";

export const isDesktopSelector = createSelector(
  state => state.stats,
  stats => stats.desktop_width >= 992
);
