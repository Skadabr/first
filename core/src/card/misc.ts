import { createCard } from "./fabric";
import { UnitTypes } from "../index";

//export function createRandomCards(n, ownerId) {
//  return createNumberSequence(n).map(() => createRandomCard(ownerId));
//}
//
//export function createRandomCard(ownerId) {
//  const type = (Math.random() * 3) | 0;
//  return createCard(type, ownerId);
//}

let turn = true;
export function createRandomCards(n, ownerId) {
  if (turn) {
    turn = false;
    return [
      createCard(1 as any, ownerId),
      createCard(1 as any, ownerId),
      createCard(0 as any, ownerId)
    ];
  } else {
    turn = true;
    return [
      createCard(0 as any, ownerId),
      createCard(2 as any, ownerId),
      createCard(0 as any, ownerId)
    ];
  }
}
