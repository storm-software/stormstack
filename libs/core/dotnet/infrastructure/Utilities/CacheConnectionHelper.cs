using StackExchange.Redis;
using OpenSystem.Core.Application.Utilities;

namespace OpenSystem.Core.Infrastructure.Utilities
{
    public class CacheConnectionHelper
    {
        static CacheConnectionHelper()
        {
            CacheConnectionHelper._lazyConnection = new Lazy <ConnectionMultiplexer>(() => {
                return ConnectionMultiplexer.Connect(ConfigurationManager.AppSetting["RedisURL"]);
            });
        }

        private static Lazy <ConnectionMultiplexer> _lazyConnection;

        public static ConnectionMultiplexer Connection
        {
            get {
                return _lazyConnection.Value;
            }
        }
    }
}
