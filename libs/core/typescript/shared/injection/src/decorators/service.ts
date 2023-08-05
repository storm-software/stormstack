/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { Injector } from "../injector";
import { Injectable, InjectableContext } from "./injectable";

export const Service = (baseType?: typeof BaseUtilityClass | any) => {
  return (
    target: new (...args: never) => BaseUtilityClass | any,
    context?: InjectableContext
  ) => {
    if (context?.kind === "class" && baseType) {
      Injector.bind(target).to(baseType);
    }

    return Injectable()(target, context);
  };
};
