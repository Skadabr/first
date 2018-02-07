import IO from "../socket";

export function readyToFight() {
  return () => {
    IO().gameIO.readyToFight();
  };
}
