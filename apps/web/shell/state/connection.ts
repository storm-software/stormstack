import { getConnection } from "../integrations/redis";

export const connection = await getConnection();
