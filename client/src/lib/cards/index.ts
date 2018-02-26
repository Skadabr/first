import { createNumberSequence } from "../../utils/common";

import { default as createCard } from "./fabric";
import { default as CardCharacteristics } from "./characteristics";

export { default as createCard } from "./fabric";
export { default as CardCharacteristics } from "./characteristics";

export function createRandomCards(n, owner_id) {
  return createNumberSequence(n).map(() => createRandomCard(owner_id));
}

export function createRandomCard(owner_id) {
  const type =
    (Math.random() * Object.keys(CardCharacteristics).length) | 0;
  return createCard(type, { owner_id });
}
