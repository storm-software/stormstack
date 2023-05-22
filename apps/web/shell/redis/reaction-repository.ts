import { RedisConnection, Repository } from "redis-om";
import { schema } from "./reaction-schema";

let repository!: Repository;

export const getRepository = async (connection: RedisConnection) => {
  if (!repository) {
    repository = new Repository(schema, connection);
  }

  repository.createIndex();
  return repository;
};
