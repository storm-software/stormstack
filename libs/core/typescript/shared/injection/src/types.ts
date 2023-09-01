/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Abstract,
  Clonable,
  MaybePromise,
  Newable
} from "@open-system/core-shared-utilities/types";

export type ServiceIdentifier<T = unknown> =
  | string
  | symbol
  | Newable<T>
  | Abstract<T>;

export type TargetType = "ConstructorArgument" | "ClassProperty" | "Variable";

export type BindingScope = "Singleton" | "Transient" | "Request";
export interface BindingScopeEnum {
  Request: BindingScope;
  Singleton: BindingScope;
  Transient: BindingScope;
}

export type BindingType =
  | "ConstantValue"
  | "Constructor"
  | "DynamicValue"
  | "Factory"
  | "Function"
  | "Instance"
  | "Invalid"
  | "Provider";
export interface BindingTypeEnum {
  ConstantValue: BindingType;
  Constructor: BindingType;
  DynamicValue: BindingType;
  Factory: BindingType;
  Function: BindingType;
  Instance: BindingType;
  Invalid: BindingType;
  Provider: BindingType;
}

export type RequestScope = Map<unknown, unknown>;

export interface Request {
  id: number;
  serviceIdentifier: ServiceIdentifier;
  parentContext: Context;
  parentRequest: Request | null;
  childRequests: Request[];
  target: any;
  bindings: any[];
  requestScope: RequestScope | null;
  addChildRequest(
    serviceIdentifier: ServiceIdentifier,
    bindings: any | any[],
    target: any
  ): Request;
}

export interface Context {
  id: number;
  container: Injector;
  plan: any;
  currentRequest: Request;
  addPlan(plan: any): void;
  setCurrentRequest(request: Request): void;
}

export type DynamicValue<T> = (context: Context) => T | Promise<T>;

export interface BindingOnSyntax<T> {
  onActivation(
    fn: (context: Context, injectable: T) => T | Promise<T>
  ): BindingWhenSyntax<T>;
  onDeactivation(
    fn: (injectable: T) => void | Promise<void>
  ): BindingWhenSyntax<T>;
}

export interface BindingWhenSyntax<T> {
  when(constraint: (request: Request) => boolean): BindingOnSyntax<T>;
  whenTargetNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenTargetIsDefault(): BindingOnSyntax<T>;
  whenTargetTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenInjectedInto(parent: NewableFunction | string): BindingOnSyntax<T>;
  whenParentNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenParentTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenAnyAncestorIs(ancestor: NewableFunction | string): BindingOnSyntax<T>;
  whenNoAncestorIs(ancestor: NewableFunction | string): BindingOnSyntax<T>;
  whenAnyAncestorNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenAnyAncestorTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenNoAncestorNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenNoAncestorTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenAnyAncestorMatches(
    constraint: (request: Request) => boolean
  ): BindingOnSyntax<T>;
  whenNoAncestorMatches(
    constraint: (request: Request) => boolean
  ): BindingOnSyntax<T>;
}

export type SimpleFactory<T, U extends unknown[] = unknown[]> = (
  ...args: U
) => T;

export type MultiFactory<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = (...args: U) => SimpleFactory<T, V>;

export type Factory<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = SimpleFactory<T, U> | MultiFactory<T, U, V>;

export type FactoryCreator<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = (context: Context) => Factory<T, U, V>;

export type AutoNamedFactory<T> = SimpleFactory<T, [string]>;

export type AutoFactory<T> = SimpleFactory<T, []>;

export type FactoryTypeFunction<T = unknown> = (
  context: Context
) => T | Promise<T>;

export enum FactoryType {
  DynamicValue = "toDynamicValue",
  Factory = "toFactory",
  Provider = "toProvider"
}

export interface FactoryDetails {
  factoryType: FactoryType;
  factory: FactoryTypeFunction | null;
}

export type Provider<T> = (
  ...args: any[]
) => ((...args: any[]) => Promise<T>) | Promise<T>;

export type ProviderCreator<T> = (context: Context) => Provider<T>;
export interface NextArgs<T = unknown> {
  avoidConstraints: boolean;
  contextInterceptor: (contexts: Context) => Context;
  isMultiInject: boolean;
  targetType: TargetType;
  serviceIdentifier: ServiceIdentifier<T>;
  key?: string | number | symbol;
  value?: unknown;
}

export interface BindingWhenOnSyntax<T>
  extends BindingWhenSyntax<T>,
    BindingOnSyntax<T> {}

export interface BindingInSyntax<T> {
  inSingletonScope(): BindingWhenOnSyntax<T>;
  inTransientScope(): BindingWhenOnSyntax<T>;
  inRequestScope(): BindingWhenOnSyntax<T>;
}

export interface BindingInWhenOnSyntax<T>
  extends BindingInSyntax<T>,
    BindingWhenOnSyntax<T> {}

export interface BindingToSyntax<T> {
  to(constructor: new (...args: never[]) => T): BindingInWhenOnSyntax<T>;
  toSelf(): BindingInWhenOnSyntax<T>;
  toConstantValue(value: T): BindingWhenOnSyntax<T>;
  toDynamicValue(func: DynamicValue<T>): BindingInWhenOnSyntax<T>;
  toConstructor<T2>(constructor: Newable<T2>): BindingWhenOnSyntax<T>;
  toFactory<
    T2,
    T3 extends unknown[] = unknown[],
    T4 extends unknown[] = unknown[]
  >(
    factory: FactoryCreator<T2, T3, T4>
  ): BindingWhenOnSyntax<T>;
  toFunction(func: T): BindingWhenOnSyntax<T>;
  toAutoFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toAutoNamedFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toProvider<T2>(provider: ProviderCreator<T2>): BindingWhenOnSyntax<T>;
  toService(service: ServiceIdentifier<T>): void;
}

export interface BindingToSyntax<T> {
  to(constructor: new (...args: never[]) => T): BindingInWhenOnSyntax<T>;
  toSelf(): BindingInWhenOnSyntax<T>;
  toConstantValue(value: T): BindingWhenOnSyntax<T>;
  toDynamicValue(func: DynamicValue<T>): BindingInWhenOnSyntax<T>;
  toConstructor<T2>(constructor: Newable<T2>): BindingWhenOnSyntax<T>;
  toFactory<
    T2,
    T3 extends unknown[] = unknown[],
    T4 extends unknown[] = unknown[]
  >(
    factory: FactoryCreator<T2, T3, T4>
  ): BindingWhenOnSyntax<T>;
  toFunction(func: T): BindingWhenOnSyntax<T>;
  toAutoFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toAutoNamedFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toProvider<T2>(provider: ProviderCreator<T2>): BindingWhenOnSyntax<T>;
  toService(service: ServiceIdentifier<T>): void;
}

export type BindingActivation<T> = (
  context: Context,
  injectable: T
) => T | Promise<T>;

export type BindingDeactivation<T> = (injectable: T) => void | Promise<void>;

export interface ContainerModuleBase {
  id: number;
}

export interface ContainerModule extends ContainerModuleBase {
  registry: ContainerModuleCallBack;
}

export interface AsyncContainerModule extends ContainerModuleBase {
  registry: AsyncContainerModuleCallBack;
}

export interface Lookup<T> extends Clonable<Lookup<T>> {
  add(serviceIdentifier: ServiceIdentifier, value: T): void;
  getMap(): Map<ServiceIdentifier, T[]>;
  get(serviceIdentifier: ServiceIdentifier): T[];
  remove(serviceIdentifier: ServiceIdentifier): void;
  removeByCondition(condition: (item: T) => boolean): T[];
  removeIntersection(lookup: Lookup<T>): void;
  hasKey(serviceIdentifier: ServiceIdentifier): boolean;
  clone(): Lookup<T>;
  traverse(func: (key: ServiceIdentifier, value: T[]) => void): void;
}

export interface ModuleActivationHandlers {
  onActivations: Lookup<BindingActivation<unknown>>;
  onDeactivations: Lookup<BindingDeactivation<unknown>>;
}

export interface ModuleActivationStore extends Clonable<ModuleActivationStore> {
  addDeactivation(
    moduleId: ContainerModuleBase["id"],
    serviceIdentifier: ServiceIdentifier<unknown>,
    onDeactivation: BindingDeactivation<unknown>
  ): void;
  addActivation(
    moduleId: ContainerModuleBase["id"],
    serviceIdentifier: ServiceIdentifier<unknown>,
    onActivation: BindingActivation<unknown>
  ): void;
  remove(moduleId: ContainerModuleBase["id"]): ModuleActivationHandlers;
}

export type ContainerResolution<T> = MaybePromise<T> | Array<MaybePromise<T>>;

type AsyncCallback<TCallback> = TCallback extends (
  ...args: infer TArgs
) => infer TResult
  ? (...args: TArgs) => Promise<TResult>
  : never;

export type Bind = <T>(
  serviceIdentifier: ServiceIdentifier<T>
) => BindingToSyntax<T>;

export type Rebind = <T>(
  serviceIdentifier: ServiceIdentifier<T>
) => BindingToSyntax<T>;

export type Unbind = <T>(serviceIdentifier: ServiceIdentifier<T>) => void;

export type UnbindAsync = <T>(
  serviceIdentifier: ServiceIdentifier<T>
) => Promise<void>;

export type IsBound = <T>(serviceIdentifier: ServiceIdentifier<T>) => boolean;

export type ContainerModuleCallBack = (
  bind: Bind,
  unbind: Unbind,
  isBound: IsBound,
  rebind: Rebind,
  unbindAsync: UnbindAsync,
  onActivation: Injector["onActivation"],
  onDeactivation: Injector["onDeactivation"]
) => void;

export type AsyncContainerModuleCallBack =
  AsyncCallback<ContainerModuleCallBack>;

export interface NextArgs<T = unknown> {
  avoidConstraints: boolean;
  contextInterceptor: (contexts: Context) => Context;
  isMultiInject: boolean;
  targetType: TargetType;
  serviceIdentifier: ServiceIdentifier<T>;
  key?: string | number | symbol;
  value?: unknown;
}

export type Next = (args: NextArgs) => any | any[];

export type Middleware = (next: Next) => Next;

export interface InjectorOptions {
  autoBindInjectable?: boolean;
  defaultScope?: BindingScope;
  skipBaseClassChecks?: boolean;
}

export interface Injector {
  id: number;
  parent: Injector | null;
  options: InjectorOptions;
  bind<T>(serviceIdentifier: ServiceIdentifier<T>): BindingToSyntax<T>;
  rebind<T>(serviceIdentifier: ServiceIdentifier<T>): BindingToSyntax<T>;
  rebindAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>
  ): Promise<BindingToSyntax<T>>;
  unbind(serviceIdentifier: ServiceIdentifier): void;
  unbindAsync(serviceIdentifier: ServiceIdentifier): Promise<void>;
  unbindAll(): void;
  unbindAllAsync(): Promise<void>;
  isBound(serviceIdentifier: ServiceIdentifier): boolean;
  isCurrentBound<T>(serviceIdentifier: ServiceIdentifier<T>): boolean;
  isBoundNamed(
    serviceIdentifier: ServiceIdentifier,
    named: string | number | symbol
  ): boolean;
  isBoundTagged(
    serviceIdentifier: ServiceIdentifier,
    key: string | number | symbol,
    value: unknown
  ): boolean;
  get<T>(serviceIdentifier: ServiceIdentifier<T>): T;
  getNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): T;
  getTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): T;
  getAll<T>(serviceIdentifier: ServiceIdentifier<T>): T[];
  getAllTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): T[];
  getAllNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): T[];
  getAsync<T>(serviceIdentifier: ServiceIdentifier<T>): Promise<T>;
  getNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): Promise<T>;
  getTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): Promise<T>;
  getAllAsync<T>(serviceIdentifier: ServiceIdentifier<T>): Promise<T[]>;
  getAllTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): Promise<T[]>;
  getAllNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): Promise<T[]>;
  onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onActivation: BindingActivation<T>
  ): void;
  onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onDeactivation: BindingDeactivation<T>
  ): void;
  resolve<T>(constructorFunction: Newable<T>): T;
  load(...modules: ContainerModule[]): void;
  loadAsync(...modules: AsyncContainerModule[]): Promise<void>;
  unload(...modules: ContainerModuleBase[]): void;
  unloadAsync(...modules: ContainerModuleBase[]): Promise<void>;
  applyCustomMetadataReader(metadataReader: any): void;
  applyMiddleware(...middleware: Middleware[]): void;
  snapshot(): void;
  restore(): void;
  createChild(): Injector;
}

/* export interface Binding<TActivated> extends Clonable<Binding<TActivated>> {
        id: number;
        moduleId: ContainerModuleBase["id"];
        activated: boolean;
        serviceIdentifier: ServiceIdentifier<TActivated>;
        constraint: ConstraintFunction;
        dynamicValue: DynamicValue<TActivated> | null;
        scope: BindingScope;
        type: BindingType;
        implementationType: Newable<TActivated> | TActivated | null;
        factory: FactoryCreator<unknown> | null;
        provider: ProviderCreator<unknown> | null;
        onActivation: BindingActivation<TActivated> | null;
        onDeactivation: BindingDeactivation<TActivated> | null;
        cache: null | TActivated | Promise<TActivated>;
    }*/
