import { DateTime } from "@open-system/core-typescript-utilities";
import { UserTypes } from "./UserTypes";

export interface UserData {
  userId: string;
  type: UserTypes;
  createdDateTime: DateTime;
  hasAgreedToCookiePolicy: boolean;
}
