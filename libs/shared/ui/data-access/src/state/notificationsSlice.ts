import { getGuid } from "@open-system/core-typescript-utilities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationTypes } from "../models";
import { Notification, NotificationsState } from "../models/NotificationsState";
import { duplicateNotificationFilter } from "../utilities/notification-filters";

// Define the initial state using that type
const initialState: NotificationsState = {
  list: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, "id">>) {
      state.list = duplicateNotificationFilter([
        ...state.list,
        { id: getGuid(), ...action.payload },
      ]);
    },
    addInfoNotification(state, action: PayloadAction<string>) {
      state.list = duplicateNotificationFilter([
        ...state.list,
        {
          id: getGuid(),
          type: NotificationTypes.INFO,
          message: action.payload,
        },
      ]);
    },
    addSuccessNotification(state, action: PayloadAction<string>) {
      state.list = duplicateNotificationFilter([
        ...state.list,
        {
          id: getGuid(),
          type: NotificationTypes.SUCCESS,
          message: action.payload,
        },
      ]);
    },
    addWarningNotification(state, action: PayloadAction<string>) {
      state.list = [
        ...state.list,
        {
          id: getGuid(),
          type: NotificationTypes.WARNING,
          message: action.payload,
        },
      ];
    },
    addErrorNotification(state, action: PayloadAction<string>) {
      state.list = duplicateNotificationFilter([
        ...state.list,
        {
          id: getGuid(),
          type: NotificationTypes.ERROR,
          message: action.payload,
        },
      ]);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.list = [
        ...state.list.filter(
          (notification: Notification) => notification.id !== action.payload
        ),
      ];
    },
    resetNotifications(state) {
      state.list = [];
    },
  },
});

export const {
  addNotification,
  resetNotifications,
  removeNotification,
  addInfoNotification,
  addSuccessNotification,
  addWarningNotification,
  addErrorNotification,
} = notificationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNotifications = (state: {
  notifications: NotificationsState;
}) => state.notifications;
export const selectNotificationList = (state: {
  notifications: NotificationsState;
}): Notification[] => state.notifications.list;

export const notificationsReducer = notificationsSlice.reducer;
