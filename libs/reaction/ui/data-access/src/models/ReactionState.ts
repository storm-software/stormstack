import { AddReactionRequestTypeEnum } from "./AddReactionRequest";

export type ReactionHistory = Record<
  string,
  AddReactionRequestTypeEnum | null | undefined
>;

export interface ReactionState {
  history: ReactionHistory;
}
