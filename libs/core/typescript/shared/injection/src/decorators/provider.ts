/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { BaseUtilityClass } from "@stormstack/core-shared-utilities/common/base-utility-class";
import { Injector } from "../injector";
import { Injectable, InjectableContext } from "./injectable";

export const Provider = (baseType?: typeof BaseUtilityClass | any) => {
  return (target: any, context?: InjectableContext) => {
    if (context?.kind === "class" && baseType) {
      Injector.bindService(baseType, target);
    }

    return Injectable()(target, context);
  };
};
