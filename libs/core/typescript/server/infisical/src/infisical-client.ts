import InfisicalClient from "infisical-node";

let client!: InfisicalClient;
export const getInfisicalClient = (token: string) => {
  if (client) {
    return client;
  }

  client = new InfisicalClient({
    token
  });

  return client;
};
