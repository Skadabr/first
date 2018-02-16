import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function loadOpponentsLog(err, res) {
  if (err) {
    logger.error(getErrorMessage(err));
  } else {
    logger.debug("io:game ---- OPPONENTS_LOAD ----");
  }
}
