import {
  contactApi,
  contactReducer,
} from "@open-system/contact-ui-data-access";
import {
  notificationsReducer,
  userReducer,
} from "@open-system/shared-ui-data-access";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationsReducer,
  contact: contactReducer,
  [contactApi.reducerPath]: contactApi.reducer,
});
