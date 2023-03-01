import { DateTime, getGuid } from "@open-system/core-typescript-utilities";
import { createSlice } from "@reduxjs/toolkit";
import { UserDataConstants, UserState, UserTypes } from "../models";

// Define the initial state using that type
const initialState: UserState = {
  id: getGuid(),
  name: UserDataConstants.DEFAULT_NAME,
  type: UserTypes.GUEST,
  createdDateTime: DateTime.current.toString(),
  hasAgreedToPrivacyPolicy: false,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    agreeToPrivacyPolicy: state => {
      state.hasAgreedToPrivacyPolicy = true;
    },
  },
});

export const { agreeToPrivacyPolicy } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: { user: UserState }) => state.user;
export const selectHasAgreedToPrivacyPolicy = (state: {
  user: UserState;
}): boolean => !!state.user?.hasAgreedToPrivacyPolicy;

export const userReducer = userSlice.reducer;
