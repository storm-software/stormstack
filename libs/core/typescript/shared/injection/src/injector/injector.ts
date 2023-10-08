import "reflect-metadata";

import { BaseUtilityClass } from "@stormstack/core-shared-utilities/common/base-utility-class";
import { Container } from "inversify";
import * as InjectionInterfaces from "../types";
import { INJECTOR_SYMBOL } from "../types";
import { CONTAINER } from "./container";

export class Injector extends BaseUtilityClass {
  private static _container: Container = CONTAINER;

  public static bindService<T = any>(
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
    service: any,
    container?: Container
  ) {
    const currentContainer = container || Injector._container;

    currentContainer.isBound(serviceIdentifier) &&
      currentContainer.unbind(serviceIdentifier);
    currentContainer.bind<T>(serviceIdentifier).to(service);
  }

  public static bindConstant<T = any>(
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
    constant: any,
    container?: Container
  ) {
    const currentContainer = container || Injector._container;

    currentContainer.isBound(serviceIdentifier) &&
      currentContainer.unbind(serviceIdentifier);
    currentContainer.bind<T>(serviceIdentifier).toConstantValue(constant);
  }

  public static get<T>(
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
    container?: Container
  ): T {
    const currentContainer = container || Injector._container;
    return currentContainer.get<T>(serviceIdentifier);
  }

  public static getAsync = async <T>(
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
    container?: Container
  ): Promise<T> => {
    const currentContainer = container || Injector._container;
    return currentContainer.getAsync<T>(serviceIdentifier);
  };

  public static isBound = (
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier,
    container?: Container
  ): boolean => {
    const currentContainer = container || Injector._container;
    return currentContainer.isBound(serviceIdentifier);
  };

  public static unbind = (
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier,
    container?: Container
  ) => {
    const currentContainer = container || Injector._container;
    return currentContainer.unbind(serviceIdentifier);
  };

  public static unbindAsync = (
    serviceIdentifier: InjectionInterfaces.ServiceIdentifier,
    container?: Container
  ): Promise<void> => {
    const currentContainer = container || Injector._container;
    return currentContainer.unbindAsync(serviceIdentifier);
  };

  /**
   * The container used for dependency injection
   *
   * @link [Inversify Container Documentation](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md)
   */
  public static get container(): Container {
    return Injector._container;
  }

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public get __base(): string {
    return "Injector";
  }

  constructor() {
    super(INJECTOR_SYMBOL);
  }
}
