import "reflect-metadata";

import { Container } from "inversify";
import * as InjectionInterfaces from "../types";

export const CONTAINER = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: InjectionInterfaces.BindingScopeEnum.SINGLETON
});
