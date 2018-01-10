import { MESSAGE_NEW, MESSAGE_SEND } from "../constants";

export default ({ dispatch, getState }) => next => action => {
  next(action);
};
