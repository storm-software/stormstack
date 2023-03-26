namespace OpenSystem.Core.Domain.Settings
{
    public class ConnectionStringSettings
    {
        public string DefaultConnection { get; set; }

        public string? CacheConnection { get; set; }

        public string? EventStoreConnection { get; set; }
    }
}
