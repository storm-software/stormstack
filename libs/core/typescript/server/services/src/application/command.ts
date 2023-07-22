import {
  IIdentity,
  IVersioned,
} from "@open-system/core-shared-utilities/types";

export interface ICommand extends IVersioned, IIdentity {
  type: string;
}
