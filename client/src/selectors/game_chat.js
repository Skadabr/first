import { createSelector } from "reselect";

export const chatMessagesSelector = createSelector(
  state => state.game_chat,
  msgs => msgs
);
