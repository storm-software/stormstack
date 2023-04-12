namespace OpenSystem.Akka.PostgreSql
{
    public class AkkaPostgreSqlSettings
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
        //     Connection timeout for SQL Server related operations.
        public TimeSpan ConnectionTimeout { get; set; }

        //
        // Summary:
        //     Name of the table corresponding to event journal.
        public string JournalTableName { get; set; }

        //
        // Summary:
        //     Name of the schema, where journal table resides.
        public string SchemaName { get; set; }

        //
        // Summary:
        //     Name of the table corresponding to event journal persistenceId and sequenceNr
        //     metadata.
        public string MetaTableName { get; set; }

        //
        // Summary:
        //     Fully qualified type name for Akka.Persistence.Sql.Common.Journal.ITimestampProvider
        //     used to generate journal timestamps.
        public string TimestampProvider { get; set; }

        //
        // Summary:
        //     Flag determining in in case of event journal or metadata table missing, they
        //     should be automatically initialized.
        public bool AutoInitialize { get; set; }
    }
}
