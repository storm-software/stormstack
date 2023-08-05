/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  InjectableContext,
} from "@open-system/core-shared-injection";
import { IntegrationEvent } from "./integration-event";

export const Event = () => {
  return (
    target: new (...args: never) => IntegrationEvent | any,
    context?: InjectableContext
  ) => {
    return Injectable()(target, context);
  };
};
