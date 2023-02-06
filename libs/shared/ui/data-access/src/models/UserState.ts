import { UserTypes } from "./UserTypes";

export interface UserState {
  id: string;
  name: string;
  type: UserTypes;
  createdDateTime: string;
  hasAgreedToPrivacyPolicy: boolean;
}
