using System.Diagnostics;
using Akka.Persistence.PostgreSql;
using Akka.Persistence.Hosting;
using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using OpenSystem.Akka.Configuration;

namespace OpenSystem.Akka.PostgreSql.Extensions
{
    public static class AkkaConfigurationBuilderExtensions
    {
        /*public static AkkaConfigurationBuilder ConfigurePostgreSqlPersistence(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {


            builder.AddHocon(
                GetPersistenceHocon(connectionJournalString)
                    .WithFallback(PostgreSqlPersistence.DefaultJournalConfig),
                HoconAddMode.Append
            );



            return builder.AddHocon(
                GetPostgreSqlPersistenceHocon(connectionJournalString, connectionSnapshotString)
                    .WithFallback(PostgreSqlPersistence.DefaultConfiguration()),
                HoconAddMode.Append
            );
        }*/

        public static Config GetPostgreSqlPersistenceHocon(IServiceProvider serviceProvide)
        {
            return $@"
                akka.persistence {{
                        {GetPostgreSqlJournalPersistenceHocon(serviceProvide)}

                        {GetPostgreSqlSnapshotPersistenceHocon(serviceProvide)}
                    }}
                ";
        }

        public static Config GetPostgreSqlJournalPersistenceHocon(IServiceProvider serviceProvider)
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            var connectionJournalStringName = configuration
                .GetSection("PostgreSqlJournalSettings")
                .Get<PostgreSqlJournalSettings>()
                ?.ConnectionStringName;
            Debug.Assert(
                connectionJournalStringName != null,
                nameof(connectionJournalStringName) + " != null"
            );
            var connectionJournalString = configuration.GetConnectionString(
                connectionJournalStringName
            );
            Debug.Assert(
                connectionJournalString != null,
                nameof(connectionJournalString) + " != null"
            );

            return GetPostgreSqlJournalPersistenceHocon(connectionJournalString);
        }

        public static Config GetPostgreSqlJournalPersistenceHocon(string connectionString)
        {
            return $@"
                    journal {{
                        plugin = ""akka.persistence.journal.postgresql""
                        postgresql {{
                            # qualified type name of the PostgreSql persistence journal actor
                            class = ""Akka.Persistence.PostgreSql.Journal.PostgreSqlJournal, Akka.Persistence.PostgreSql""

                            # dispatcher used to drive journal actor
                            plugin-dispatcher = ""akka.actor.default-dispatcher""

                            # connection string used for database access
                            connection-string = ""{connectionString}""

                            # default SQL commands timeout
                            connection-timeout = 30s

                            # PostgreSql schema name to table corresponding with persistent journal
                            schema-name = public

                            # PostgreSql table corresponding with persistent journal
                            table-name = event_journal

                            # should corresponding journal table be initialized automatically
                            auto-initialize = off

                            # timestamp provider used for generation of journal entries timestamps
                            timestamp-provider = ""Akka.Persistence.Sql.Common.Journal.DefaultTimestampProvider, Akka.Persistence.Sql.Common""

                            # metadata table
                            metadata-table-name = metadata

                            # defines column db type used to store payload. Available option: BYTEA (default), JSON, JSONB
                            stored-as = BYTEA

                            # Setting used to toggle sequential read access when loading large objects
                            # from journals and snapshot stores.
                            sequential-access = off

                            # When turned on, persistence will use `BIGINT` and `GENERATED ALWAYS AS IDENTITY`
                            # for journal table schema creation.
                            # NOTE: This only affects newly created tables, as such, it should not affect any
                            #       existing database.
                            #
                            # !!!!! WARNING !!!!!
                            # To use this feature, you have to have PostgreSql version 10 or above
                            use-bigint-identity-for-ordering-column = on

                            # Setting used to change size of the tags column in persistent journal table
                            tags-column-size = 2000
                        }}
                    }}
                ";
        }

        public static Config GetPostgreSqlSnapshotPersistenceHocon(IServiceProvider serviceProvider)
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var connectionSnapshotStringName = configuration
                .GetSection("PostgreSqlSnapshotSettings")
                .Get<PostgreSqlSnapshotStoreSettings>()
                ?.ConnectionStringName;
            Debug.Assert(
                connectionSnapshotStringName != null,
                nameof(connectionSnapshotStringName) + " != null"
            );
            var connectionSnapshotString = configuration.GetConnectionString(
                connectionSnapshotStringName
            );
            Debug.Assert(
                connectionSnapshotString != null,
                nameof(connectionSnapshotString) + " != null"
            );

            return GetPostgreSqlSnapshotPersistenceHocon(connectionSnapshotString);
        }

        public static Config GetPostgreSqlSnapshotPersistenceHocon(string connectionString)
        {
            return $@"
                    snapshot-store {{
                        plugin = ""akka.persistence.snapshot-store.postgresql""
                        postgresql {{
                            # qualified type name of the PostgreSql persistence journal actor
			                class = ""Akka.Persistence.PostgreSql.Snapshot.PostgreSqlSnapshotStore, Akka.Persistence.PostgreSql""

                            # dispatcher used to drive journal actor
                            plugin-dispatcher = ""akka.actor.default-dispatcher""

                            # connection string used for database access
                            connection-string = ""{connectionString}""

                            # default SQL commands timeout
                            connection-timeout = 30s

                            # PostgreSql schema name to table corresponding with persistent journal
                            schema-name = public

                            # PostgreSql table corresponding with persistent journal
                            table-name = snapshot_store

                            # should corresponding journal table be initialized automatically
                            auto-initialize = off

                            # defines column db type used to store payload. Available option: BYTEA (default), JSON, JSONB
                            stored-as = BYTEA

                            # Setting used to toggle sequential read access when loading large objects
                            # from journals and snapshot stores.
                            sequential-access = off
                        }}
                    }}
                ";
        }
    }
}
