namespace OpenSystem.Akka.Redis
{
    public class RedisReadStoreSettings
    {
        //
        // Summary:
        //     Connection string used to access a persistent SQL Server instance.
        public string ConnectionString { get; set; }

        //
        // Summary:
        //     Name of the connection string stored in <connectionStrings> section of *.config
        //     file.
        public string ConnectionStringName { get; set; }

        //
        // Summary:
        //     Name of the table corresponding to event journal.
        public string RedisInstanceName { get; set; }
    }
}
