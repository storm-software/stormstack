import { contactReducer } from "@open-system/contact-ui-data-access";
import { contactApi } from "@open-system/contact-ui-data-access/apis";
import { reactionReducer } from "@open-system/reaction-ui-data-access/state";
import { reactionApi } from "@open-system/reaction-ui-data-access/apis";
import {
  notificationsReducer,
  userReducer,
} from "@open-system/shared-ui-data-access";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationsReducer,
  contact: contactReducer,
  reaction: reactionReducer,
  [reactionApi.reducerPath]: reactionApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
});
