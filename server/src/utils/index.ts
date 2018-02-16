const { NODE_ENV } = process.env;

export function getErrorMessage(err) {
  if (NODE_ENV === "development") {
    return err.stack;
  } else {
    return err.message;
  }
}
