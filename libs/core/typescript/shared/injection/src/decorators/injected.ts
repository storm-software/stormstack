/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from "inversify";
import { ServiceIdentifierOrFunc } from "inversify/lib/annotation/lazy_service_identifier";

export type InjectedContext = {
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

export const Injected = <T = any>(
  serviceIdentifier: ServiceIdentifierOrFunc<T>
) => {
  return (
    target: any,
    targetKey?: string | symbol | undefined,
    indexOrPropertyDescriptor?: any
  ) => {
    return inject<T>(serviceIdentifier)(
      target,
      targetKey,
      indexOrPropertyDescriptor
    );
  };
};
