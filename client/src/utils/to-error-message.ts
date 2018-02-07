export default function toErrorMessage(e: any) {
  if (e.response && e.response.data) {
    if (e.response.data.error) {
      throw new Error(e.response.data.error.message);
    } else {
      throw new Error("Bad request");
    }
  }
  throw e;
}
