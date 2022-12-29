import { UserData, UserTypes } from "../models";

export abstract class AbstractUserDataService {
  public abstract addUserData(
    id?: string,
    type?: UserTypes
  ): Promise<undefined>;

  public abstract updateUserData(
    id: string,
    type?: UserTypes
  ): Promise<undefined>;

  public abstract deleteUserData(id: string): Promise<undefined>;

  public abstract getUserData(id?: string): Promise<UserData>;
}
