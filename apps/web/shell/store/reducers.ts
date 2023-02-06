import { userReducer } from "@open-system/shared-ui-data-access";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user: userReducer,
});
