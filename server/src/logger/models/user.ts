import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function createUserLog(err, {email}) {
  logger.debug(`models:user - ${email} is created`);
}
