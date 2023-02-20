import { apiSlice, contactReducer } from "@open-system/contact-ui-data-access";
import {
  notificationsReducer,
  userReducer,
} from "@open-system/shared-ui-data-access";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userReducer,
  notifications: notificationsReducer,
  contact: contactReducer,
});
