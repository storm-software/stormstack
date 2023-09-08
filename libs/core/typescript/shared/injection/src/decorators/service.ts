/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities/common/base-utility-class";
import { Injector } from "../injector";
import { Injectable, InjectableContext } from "./injectable";

export const Provider = (baseType?: typeof BaseUtilityClass | any) => {
  return (target: any, context?: InjectableContext) => {
    if (context?.kind === "class" && baseType) {
      Injector.bind(target).to(baseType);
    }

    return Injectable()(target, context);
  };
};
