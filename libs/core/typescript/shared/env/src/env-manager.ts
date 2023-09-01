/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { createEnvProxy } from "./create-env-proxy";
import { DEFAULT_OPTIONS } from "./env-manager-options";
import { BaseOptions, ENV_TOKEN, EnvProxy } from "./types";

export abstract class EnvManager<
  TOptions extends BaseOptions = BaseOptions
> extends BaseUtilityClass {
  protected proxy: EnvProxy;

  constructor(public readonly options = DEFAULT_OPTIONS as TOptions) {
    super(ENV_TOKEN);

    this.proxy = createEnvProxy({ ...DEFAULT_OPTIONS, ...this.options });
  }

  public abstract get: <T = any>(name: string) => T | undefined;

  public abstract getAsync: <T = any>(name: string) => Promise<T | undefined>;
}
