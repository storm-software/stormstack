import { createClient } from "redis";
import { RedisConnection } from "redis-om";

const { REDIS_CACHE_HOST, REDIS_CACHE_POST, REDIS_CACHE_PASSWORD } =
  process.env;

export const getConnection = async (): Promise<RedisConnection> => {
  const client = createClient({
    password: REDIS_CACHE_PASSWORD,
    socket: {
      host: REDIS_CACHE_HOST,
      port: REDIS_CACHE_POST ? Number.parseInt(REDIS_CACHE_POST) : 10117,
    },
  });

  await client.connect();

  return client;
};
