import { UserData } from "../models";

export abstract class AbstractUserDataService {
  public abstract addUserData(userData: Partial<UserData>): Promise<undefined>;

  public abstract updateUserData(
    userData: Partial<UserData>
  ): Promise<undefined>;

  public abstract deleteUserData(userId: string): Promise<undefined>;

  public abstract getUserData(userId?: string | null): Promise<UserData>;
}
