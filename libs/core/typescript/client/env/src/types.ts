import { BaseOptions } from "@stormstack/core-shared-env/types";

export type ClientBaseEnvManagerOptions = BaseOptions & {
  defaultGateway: string;
};

export type EnvironmentSpecificClientEnvManagerOptions = Omit<
  ClientBaseEnvManagerOptions,
  "isServer" | "prefix"
>;

export type ClientPublicEnvManagerOptions =
  EnvironmentSpecificClientEnvManagerOptions & {
    isServer: false;
    prefix: "NEXT_PUBLIC_";
  };

export type ClientPrivateEnvManagerOptions =
  EnvironmentSpecificClientEnvManagerOptions & {
    isServer: true;
    prefix: undefined;
  };
