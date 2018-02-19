import { createSelector } from "reselect";

export const showBattleChatSelector = createSelector(
  state => state.ui,
  ({ show_battle_chat }) => show_battle_chat,
);

export const isDesktopSelector = createSelector(
  state => state.ui,
  stats => stats.desktop_width >= 992
);
