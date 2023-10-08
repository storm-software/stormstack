import { Container } from "inversify";
import { InjectorProxy } from "../types";
import { CONTAINER } from "./container";
import { Injector } from "./injector";

/**
 * Creates an Injector proxy that can be used to access environment variables.
 *
 * @returns The Injector proxy object
 */
export const createInjectorProxy = (): InjectorProxy => {
  const injector = Injector;
  return new Proxy<Container>(CONTAINER, {
    get: (target: Container, prop: string) => {
      switch (prop) {
        case "get":
          return <T>(serviceIdentifier: any) =>
            injector.get<T>(serviceIdentifier, target);
        case "getAsync":
          return <T>(serviceIdentifier: any) =>
            injector.getAsync<T>(serviceIdentifier, target);

        case "isBound":
          return (serviceIdentifier: any) =>
            injector.isBound(serviceIdentifier, target);

        case "unbind":
          return (serviceIdentifier: any) =>
            injector.unbind(serviceIdentifier, target);

        case "unbindAsync":
          return (serviceIdentifier: any) =>
            injector.unbindAsync(serviceIdentifier, target);

        case "bindService":
          return <T>(serviceIdentifier: any, service: T) =>
            injector.bindService<T>(serviceIdentifier, service, target);

        case "bindConstant":
          return <T>(serviceIdentifier: any, constant: T) =>
            injector.bindConstant<T>(serviceIdentifier, constant, target);

        case "container":
          return target;
      }

      return null;
    },
    set: (
      target: Container,
      prop: string | symbol,
      newValue: any,
      _: any
    ): boolean => {
      return true;
    }
  }) as unknown as InjectorProxy;
};
