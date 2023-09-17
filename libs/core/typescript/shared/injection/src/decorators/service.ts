/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { BaseUtilityClass } from "@open-system/core-shared-utilities/common/base-utility-class";
import { bindService } from "../utilities/bind-service";
import { Injectable, InjectableContext } from "./injectable";

export const Provider = (baseType?: typeof BaseUtilityClass | any) => {
  return (target: any, context?: InjectableContext) => {
    if (context?.kind === "class" && baseType) {
      bindService(baseType, target);
    }

    return Injectable()(target, context);
  };
};
