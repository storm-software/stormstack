import { IIdentity, IVersioned } from "@stormstack/core-shared-utilities/types";

export interface ICommand<TRequest = Record<string, any>>
  extends IVersioned,
    IIdentity {
  request: TRequest;
  correlationId: string;
}
