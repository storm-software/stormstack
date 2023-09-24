/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { InjectionInterfaces } from "..";
import { Injector } from "../injector/injector";

export const bindService = <T = any>(
  serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
  service: any,
  injector: InjectionInterfaces.Injector = Injector
) => {
  injector.isBound(serviceIdentifier) && injector.unbind(serviceIdentifier);
  injector.bind<T>(serviceIdentifier).to(service);
};

export const bindConstant = <T = any>(
  serviceIdentifier: InjectionInterfaces.ServiceIdentifier<T>,
  constant: any,
  injector: InjectionInterfaces.Injector = Injector
) => {
  injector.isBound(serviceIdentifier) && injector.unbind(serviceIdentifier);
  injector.bind<T>(serviceIdentifier).toConstantValue(constant);
};
