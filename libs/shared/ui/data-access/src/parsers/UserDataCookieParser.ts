("use client");

import { DateTime } from "@open-system/core-typescript-utilities";
import { injectable } from "inversify";
import { UserData, UserTypes } from "../models";

/**
 * Parser for user data stored in cookies
 */
@injectable()
export class UserDataCookieParser {
  public toJson(strData: string): UserData {
    const userData = JSON.parse(strData);

    let createdDateTime = DateTime.current;
    if (userData.createdDateTime) {
      createdDateTime = DateTime.create(userData.createdDateTime);
    }

    userData.createdDateTime = createdDateTime;
    userData.type ??= UserTypes.GUEST;

    return userData;
  }

  /**
   * Add a new reaction to an article
   * Add Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId User Id sending request
   */
  public toString(objData: UserData): string {
    return JSON.stringify({
      ...objData,
      createdDateTime: objData.createdDateTime.toString(),
    });
  }
}
