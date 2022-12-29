("use client");

import { AbstractCookieParser } from "@open-system/core-typescript-utilities";
import { UserData } from "../models";

/**
 * Parser for user data stored in cookies
 */
export abstract class AbstractUserDataCookieParser extends AbstractCookieParser<UserData> {
  public abstract toJson(strData: string): UserData;

  public abstract toString(objData: UserData): string;
}
