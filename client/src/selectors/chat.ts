import { createSelector } from "reselect";

export const chatMessagesSelector = createSelector(
  state => state.chat,
  msgs => msgs
);
