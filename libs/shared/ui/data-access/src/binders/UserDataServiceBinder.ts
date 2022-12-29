import { interfaces } from "inversify";
import { UserDataCookieService } from "../cookies";
import { UserDataCookieParser } from "../parsers";
import {
  AbstractUserDataCookieParser,
  AbstractUserDataService,
} from "../services";

/**
 * Helper class to simplify binding the services
 */
export class UserDataServiceBinder {
  public static with(_container: interfaces.Container): UserDataServiceBinder {
    return new UserDataServiceBinder(_container);
  }

  protected constructor(private container: interfaces.Container) {
    this.container
      .bind(AbstractUserDataCookieParser)
      .to(UserDataCookieParser)
      .inSingletonScope();
    this.container
      .bind(AbstractUserDataService)
      .to(UserDataCookieService)
      .inSingletonScope();
  }
}
