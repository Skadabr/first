import { createNumberSequence } from "../../utils/common";

import { default as createCard } from "./fabric";

export function createRandomCards(n, owner_id) {
  return createNumberSequence(n).map(() => createRandomCard(owner_id));
}

export function createRandomCard(owner_id) {
  const type = (Math.random() * 2) | 0;
  return createCard(type, owner_id);
}
