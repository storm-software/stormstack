/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { injectable } from "inversify";

export type InjectableContext = {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
  };
  private?: boolean;
  static?: boolean;
  addInitializer?(initializer: () => void): void;
};

export const Injectable = () => {
  return (
    target: new (...args: never) => BaseUtilityClass | any,
    context?: InjectableContext
  ) => {
    if (context?.kind === "class") {
      return injectable()(target);
    }

    return injectable()(target);
  };
};
