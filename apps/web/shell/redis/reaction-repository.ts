import { RedisConnection, Repository } from "redis-om";
import { schema } from "./reaction-schema";

export const getRepository = async (connection: RedisConnection) => {
  return new Repository(schema, connection);
};
