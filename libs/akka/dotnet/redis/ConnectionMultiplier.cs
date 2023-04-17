using StackExchange.Redis;

namespace OpenSystem.Akka.Redis
{
    public class RedisReadStore
    {
        public IDatabase db { get; set; }

        private ConnectionMultiplexer _redis;

        public void Connect(string connectionSetting)
        {
            _redis = ConnectionMultiplexer.Connect(connectionSetting);
        }

        public IDatabase GetDb(int db)
        {
            return _redis.GetDatabase(db);
        }
    }
}
