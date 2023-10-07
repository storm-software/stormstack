/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import getDecorators from "inversify-inject-decorators";
import { Injector } from "../injector/injector";
import { ServiceIdentifier } from "../types";

export type LazyInjectedContext = {
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

const { lazyInject } = getDecorators(Injector.container);

export const LazyInjected = <T = any>(
  serviceIdentifier: ServiceIdentifier<T>
) => {
  return (target: any, targetKey: string) => {
    return lazyInject(serviceIdentifier)(target, targetKey);
  };
};
