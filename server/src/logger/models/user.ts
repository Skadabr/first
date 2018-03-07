import { logger } from "../index";
import { getErrorMessage } from "../../utils/index";

export function createUserLog(err, {email}) {
  logger.debug(`models:user - ${email} is created`);
}
