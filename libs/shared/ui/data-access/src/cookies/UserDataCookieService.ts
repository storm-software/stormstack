import {
  DateTime,
  getUniqueNumericId,
} from "@open-system/core-typescript-utilities";
import { inject, injectable } from "inversify";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { UserData, UserDataConstants, UserTypes } from "../models";
import { AbstractUserDataCookieParser } from "../services/UserDataCookieParser";

@injectable()
export class UserDataCookieService {
  constructor(
    @inject(AbstractUserDataCookieParser)
    private parser: AbstractUserDataCookieParser
  ) {}

  public async addUserData(
    userId?: string,
    type: UserTypes = UserTypes.GUEST,
    hasAgreedToCookiePolicy = false
  ): Promise<undefined> {
    if (!this.cookieExists()) {
      setCookie(
        null,
        UserDataConstants.COOKIE_NAME,
        this.parser.toString({
          userId: userId ? userId : `${type}-${getUniqueNumericId(9)}`,
          type,
          createdDateTime: DateTime.current,
          hasAgreedToCookiePolicy,
        })
      );
    }

    return Promise.resolve(undefined);
  }

  public async updateUserData(
    userId: string,
    type?: UserTypes,
    hasAgreedToCookiePolicy = false
  ): Promise<undefined> {
    const userData: UserData = await this.getUserData(userId);

    setCookie(
      null,
      UserDataConstants.COOKIE_NAME,
      this.parser.toString({
        ...userData,
        userId,
        type: type ? type : userData.type,
        hasAgreedToCookiePolicy: hasAgreedToCookiePolicy
          ? hasAgreedToCookiePolicy
          : userData.hasAgreedToCookiePolicy,
      })
    );

    return Promise.resolve(undefined);
  }

  public async deleteUserData(_userId: string): Promise<undefined> {
    if (this.cookieExists()) {
      destroyCookie(null, UserDataConstants.COOKIE_NAME);
    }

    return Promise.resolve(undefined);
  }

  public async getUserData(userId?: string): Promise<UserData> {
    let cookie = parseCookies()?.[UserDataConstants.COOKIE_NAME];
    if (!cookie) {
      await this.addUserData(userId);

      cookie = parseCookies()?.[UserDataConstants.COOKIE_NAME];
      if (!cookie) {
        throw new Error("An error occurred fetching user data");
      }
    }

    return Promise.resolve(this.parser.toJson(cookie));
  }

  private cookieExists(): boolean {
    return !!parseCookies()?.[UserDataConstants.COOKIE_NAME];
  }
}
