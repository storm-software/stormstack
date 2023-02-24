import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddReactionRequestTypeEnum } from "../models";
import { ReactionHistory, ReactionState } from "../models/ReactionState";

// Define the initial state using that type
const initialState: ReactionState = {
  history: {},
};

export const reactionSlice = createSlice({
  name: "reaction",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addReactionHistory(
      state,
      action: PayloadAction<{
        contentId: string;
        type: AddReactionRequestTypeEnum | null;
      }>
    ) {
      action.payload.contentId &&
        (state.history[action.payload.contentId] = action.payload.type);
    },
    removeReactionHistory(state, action: PayloadAction<string>) {
      delete state.history[action.payload];
    },
    resetReaction(state) {
      state.history = {};
    },
  },
});

export const { addReactionHistory, removeReactionHistory, resetReaction } =
  reactionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectReaction = (state: {
  reaction: ReactionState;
}): ReactionState => state.reaction;
export const selectReactionHistory = (state: {
  reaction: ReactionState;
}): ReactionHistory => state.reaction.history;
export const selectReactionType =
  (contentId: string) =>
  (state: { reaction: ReactionState }): AddReactionRequestTypeEnum | null =>
    state.reaction.history?.[contentId] ?? null;

export const reactionReducer = reactionSlice.reducer;
