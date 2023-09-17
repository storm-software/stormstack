import { Container } from "inversify";
import * as InjectionInterfaces from "../types";

export const Injector: InjectionInterfaces.Injector = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true
});
