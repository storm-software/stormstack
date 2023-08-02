import { Adapter } from "next-auth/adapters";

/** @return { import("next-auth/adapters").Adapter } */
export const AuthAdapter: Adapter = {
  async createUser(user: Omit<AdapterUser, "id">) {
    return;
  },
  async getUser(id: string) {
    return;
  },
  async getUserByEmail(email: string) {
    return;
  },
  async getUserByAccount({ providerAccountId, provider }) {
    return;
  },
  async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
    return;
  },
  async deleteUser(userId: string) {
    return;
  },
  async linkAccount(account: AdapterAccount) {
    return;
  },
  async unlinkAccount(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ) {
    return;
  },
  async createSession(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) {
    return;
  },
  async getSessionAndUser(sessionToken: string) {
    return;
  },
  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ) {
    return;
  },
  async deleteSession(sessionToken: string) {
    return;
  },
  async createVerificationToken(verificationToken: VerificationToken) {
    return;
  },
  async useVerificationToken(params: { identifier: string; token: string }) {
    return;
  },
};
