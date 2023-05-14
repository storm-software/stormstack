import { RedisConnection, Repository } from "redis-om";
import { schema } from "./reaction-schema";

export const getRepository = async (connection: RedisConnection) => {
  const repository = new Repository(schema, connection);
  repository.createIndex();

  return repository;
};
