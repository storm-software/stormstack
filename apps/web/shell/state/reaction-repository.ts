/*import { RedisConnection, Repository } from "redis-om";
import { redis } from "../integrations/redis";
import { schema } from "./reaction-schema";

export const repository = new Repository(schema, redis);
repository.createIndex();*/

/*let repository!: Repository;

export const getRepository = async (connection: RedisConnection) => {
  if (!repository) {
    repository = new Repository(schema, connection);
  }

  repository.createIndex();
  return repository;
};*/
