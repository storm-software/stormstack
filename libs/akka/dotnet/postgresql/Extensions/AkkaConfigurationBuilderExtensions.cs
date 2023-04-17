using System.Diagnostics;
using Akka.Persistence.PostgreSql;
using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using OpenSystem.Akka.Configuration;
using Akka.Persistence.PostgreSql.Hosting;
using Akka.Actor;
using Akka.Hosting;
using Akka.Persistence.Hosting;
using PersistenceMode = Akka.Persistence.Hosting.PersistenceMode;
using OpenSystem.Akka.PostgreSql.Constants;
using Akka.Persistence.Sql.Hosting;
using Akka.Persistence.Sql;

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

        public static AkkaConfigurationBuilder ConfigurePostgreSqlPersistence(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider,
            Action<AkkaPersistenceJournalBuilder>? journalBuilder = null
        )
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            var writeSettings = configuration
                .GetSection("PostgreSqlWriteJournalSettings")
                .Get<AkkaPostgreSqlSettings>();
            Debug.Assert(writeSettings != null, nameof(writeSettings) + " != null");
            writeSettings.ConnectionString = configuration.GetConnectionString(
                writeSettings.ConnectionStringName
            );
            Debug.Assert(
                writeSettings.ConnectionString != null,
                nameof(writeSettings.ConnectionString) + " != null"
            );

            /*var readSettings = configuration
                .GetSection("PostgreSqlReadJournalSettings")
                .Get<AkkaPostgreSqlSettings>();
            Debug.Assert(readSettings != null, nameof(readSettings) + " != null");
            readSettings.ConnectionString = configuration.GetConnectionString(
                readSettings.ConnectionStringName
            );
            Debug.Assert(
                readSettings.ConnectionString != null,
                nameof(readSettings.ConnectionString) + " != null"
            );*/

            /* builder
                 .WithPostgreSqlPersistence(
                     writeSettings.ConnectionString,
                     PersistenceMode.Both,
                     "public",
                     true,
                     StoredAsType.ByteA,
                     false,
                     true,
                     journalBuilder,
                     AkkaPostgreSqlConstants.PluginId

                     builder.WithSqlPersistence(
                writeSettings.ConnectionString,
                LinqToDB.ProviderName.PostgreSQL15,
                PersistenceMode.Both,
                "public",
                journalBuilder,
                true,
                AkkaPostgreSqlConstants.PluginId,
                false
            );
                 )*/


            return builder.AddHocon(
                GetPostgreSqlLinqToDBPersistenceHocon(
                    writeSettings.ConnectionString,
                    writeSettings.ConnectionString,
                    writeSettings.ConnectionString
                ),
                HoconAddMode.Prepend
            );
        }

        /* public static Config GetPostgreSqlLinqToDBPersistenceHocon(IServiceProvider serviceProvider)
         {
             var settings = serviceProvider.GetRequiredService<AkkaSettings>();
             var configuration = serviceProvider.GetRequiredService<IConfiguration>();

             var readSettings = configuration
                 .GetSection("PostgreSqlReadJournalSettings")
                 .Get<AkkaPostgreSqlSettings>();
             Debug.Assert(
                 readSettings.ConnectionStringName != null,
                 nameof(readSettings.ConnectionStringName) + " != null"
             );
             readSettings.ConnectionString = configuration.GetConnectionString(
                 readSettings.ConnectionStringName
             );
             Debug.Assert(
                 readSettings.ConnectionString != null,
                 nameof(readSettings.ConnectionString) + " != null"
             );

             var writeSettings = configuration
                 .GetSection("PostgreSqlWriteJournalSettings")
                 .Get<AkkaPostgreSqlSettings>();
             Debug.Assert(writeSettings != null, nameof(writeSettings) + " != null");
             writeSettings.ConnectionString = configuration.GetConnectionString(
                 writeSettings.ConnectionStringName
             );
             Debug.Assert(
                 writeSettings.ConnectionString != null,
                 nameof(writeSettings.ConnectionString) + " != null"
             );

             return GetPostgreSqlLinqToDBPersistenceHocon(readSettings, writeSettings);
         }*/

        public static Config GetPostgreSqlLinqToDBPersistenceHocon(
            string writeJournalConnectionString,
            string readJournalConnectionString,
            string snapshotConnectionString
        )
        {
            return $@"
    akka.persistence {{
     journal {{
        # Absolute path to the journal plugin configuration entry used by
        # persistent actor or view by default.
        # Persistent actor or view can override `journalPluginId` method
        # in order to rely on a different journal plugin.
        plugin = ""{AkkaPostgreSqlConstants.WriteJournalPluginId}""

        # List of journal plugins to start automatically. Use "" for the default journal plugin.
        auto-start-journals = [""{AkkaPostgreSqlConstants.WriteJournalPluginId}""]

        sharding {{
            # qualified type name of the persistence journal actor
            class = ""Akka.Persistence.Sql.Journal.SqlWriteJournal, Akka.Persistence.Sql""

            # connection string used for database access
            connection-string = ""{writeJournalConnectionString}""

            # separate collections / tables for Akka.Cluster.Sharding
            collection = ""EventJournalSharding""
            metadata-collection = ""MetadataSharding""
        }}

       sql {{
         class = ""Akka.Persistence.Sql.Journal.SqlWriteJournal, Akka.Persistence.Sql""
         plugin-dispatcher = ""akka.persistence.dispatchers.default-plugin-dispatcher""
         connection-string = ""{writeJournalConnectionString}""

        collection = ""EventJournal""
        metadata-collection = ""Metadata""

         # Provider name is required.
         # Refer to LinqToDb.ProviderName for values
         # Always use a specific version if possible
         # To avoid provider detection performance penalty
         # Don't worry if your DB is newer than what is listed;
         # Just pick the newest one (if yours is still newer)
         provider-name = ""{LinqToDB.ProviderName.PostgreSQL15}""

         # If true, journal_metadata is created and used for deletes
         # and max sequence number queries.
         # note that there is a performance penalty for using this.
         delete-compatibility-mode = true

         # The database schema, table names, and column names configuration mapping.
         # The details are described in their respective configuration block below.
         # If set to sqlite, sql-server, mysql, or postgresql,
         # column names will be compatible with legacy Akka.NET persistence sql plugins
         table-mapping = postgresql

         # If more entries than this are pending, writes will be rejected.
         # This setting is higher than JDBC because smaller batch sizes
         # Work better in testing and we want to add more buffer to make up
         # For that penalty.
         buffer-size = 5000

         # Batch size refers to the number of items included in a batch to DB
         #  (In cases where an AtomicWrite is greater than batch-size,
         #   The Atomic write will still be handled in a single batch.)
         # JDBC Default is/was 400 but testing against scenarios indicates
         # 100 is better for overall latency. That said,
         # larger batches may be better if you have A fast/local DB.
         batch-size = 100

         # This batch size controls the maximum number of rows that will be sent
         # In a single round trip to the DB. This is different than the -actual- batch size,
         # And intentionally set larger than batch-size,
         # to help atomic writes be faster
         # Note that Linq2Db may use a lower number per round-trip in some cases.
         db-round-trip-max-batch-size = 1000

         # Linq2Db by default will use a built string for multi-row inserts
         # Somewhat counterintuitively, this is faster than using parameters in most cases,
         # But if you would prefer parameters, you can set this to true.
         prefer-parameters-on-multirow-insert = false

         # Denotes the number of messages retrieved
         # Per round-trip to DB on recovery.
         # This is to limit both size of dataset from DB (possibly lowering locking requirements)
         # As well as limit memory usage on journal retrieval in CLR
         replay-batch-size = 1000

         # Number of Concurrent writers.
         # On larger servers with more cores you can increase this number
         # But in most cases 2-4 is a safe bet.
         parallelism = 4

         # If a batch is larger than this number,
         # Plugin will utilize Linq2db's
         # Default bulk copy rather than row-by-row.
         # Currently this setting only really has an impact on
         # SQL Server and IBM Informix (If someone decides to test that out)
         # SQL Server testing indicates that under this number of rows, (or thereabouts,)
         # MultiRow is faster than Row-By-Row.
         max-row-by-row-size = 100

         # Only set to TRUE if unit tests pass with the connection string you intend to use!
         # This setting will go away once https://github.com/linq2db/linq2db/issues/2466 is resolved
         use-clone-connection = false

         # This dispatcher will be used for the Stream Materializers
         # Note that while all calls will be Async to Linq2Db,
         # If your provider for some reason does not support async,
         # or you are a very heavily loaded system,
         # You may wish to provide a dedicated dispatcher instead
         materializer-dispatcher = ""akka.actor.default-dispatcher""

         # This setting dictates how journal event tags are being stored inside the database.
         # Valid values:
         #   * Csv
         #     This value will make the plugin stores event tags in a CSV format in the
         #     `tags` column inside the journal table. This is the backward compatible
         #     way of storing event tag information.
         #   * TagTable
         #     This value will make the plugin stores event tags inside a separate tag
         #     table to improve tag related query speed.
         tag-write-mode = TagTable

         # The character used to delimit the CSV formatted tag column.
         # This setting is only effective if `tag-write-mode` is set to `Csv`
         tag-separator = "";""

         # should corresponding journal table be initialized automatically
         # if delete-compatibility-mode is true, both tables are created
         # if delete-compatibility-mode is false, only journal table will be created.
         auto-initialize = true

         # if true, a warning will be logged
         # if auto-init of tables fails.
         # set to false if you don't want this warning logged
         # perhaps if running CI tests or similar.
         warn-on-auto-init-fail = true

         dao = ""Akka.Persistence.Sql.Journal.Dao.ByteArrayJournalDao, Akka.Persistence.Sql""

         # Default serializer used as manifest serializer when applicable and payload serializer when
         # no specific binding overrides are specified.
         # If set to null, the default `System.Object` serializer is used.
         serializer = null

         # Default table name and column name mapping
         # Use this if you're not migrating from old Akka.Persistence plugins
         default {{
           # If you want to specify a schema for your tables, you can do so here.
           schema-name = public

           journal {{
             # A flag to indicate if the writer_uuid column should be generated and be populated in run-time.
             # Notes:
             #   1. The column will only be generated if auto-initialize is set to true.
             #   2. This feature is Akka.Persistence.Sql specific, setting this to true will break
             #      backward compatibility with databases generated by other Akka.Persistence plugins.
             #   3. To make this feature work with legacy plugins, you will have to alter the old
             #      journal table:
             #        ALTER TABLE [journal_table_name] ADD [writer_uuid_column_name] VARCHAR(128);
             #   4. If set to true, the code will not check for backward compatibility. It will expect
             #      that the `writer-uuid` column to be present inside the journal table.
             use-writer-uuid-column = true

             table-name = ""event_journal""

             columns {{
               ordering = ordering
               deleted = is_deleted
               persistence-id = persistence_id
               sequence-number = sequence_nr
               created = created_at
               tags = tags
               message = payload
               identifier = serializer_id
               manifest = manifest
               writer-uuid = writer_uuid
             }}
           }}

           metadata {{
               table-name = ""metadata""

               columns {{
                   persistence-id = persistence_id
                   sequence-number = sequence_nr
               }}
           }}

        tag {{
          table-name = ""tags""
          columns {{
            ordering-id = ordering_id
            tag-value = tag
            persistence-id = persistence_id
            sequence-nr = sequence_nr
          }}
        }}

       }}


         # Akka.Persistence.PostgreSql compatibility table name and column name mapping
         postgresql {{
           schema-name = public

           journal {{
             use-writer-uuid-column = true
             table-name = ""event_journal""

             columns {{
               ordering = ordering
               deleted = is_deleted
               persistence-id = persistence_id
               sequence-number = sequence_nr
               created = created_at
               tags = tags
               message = payload
               identifier = serializer_id
               manifest = manifest
               writer-uuid = writer_uuid
             }}
           }}

           metadata {{
             table-name = ""metadata""

             columns {{
               persistence-id = persistence_id
               sequence-number = sequence_nr
             }}
           }}

           tag {{
          table-name = ""tags""
          columns {{
            ordering-id = ordering_id
            tag-value = tag
            persistence-id = persistence_id
            sequence-nr = sequence_nr
          }}
        }}
         }}


         # Akka.Persistence.SqlServer compatibility table name and column name mapping
      sql-server {{
        schema-name = dbo
        journal {{
          use-writer-uuid-column = false
          table-name = ""EventJournal""
          columns {{
            ordering = Ordering
            deleted = IsDeleted
            persistence-id = PersistenceId
            sequence-number = SequenceNr
            created = Timestamp
            tags = Tags
            message = Payload
            identifier = SerializerId
            manifest = Manifest
          }}
        }}

        metadata {{
          table-name = ""Metadata""
          columns {{
            persistence-id = PersistenceId
            sequence-number = SequenceNr
          }}
        }}
      }}

      sqlserver = ${{akka.persistence.journal.sql.sql-server}} # backward compatibility naming

      # Akka.Persistence.Sqlite compatibility table name and column name mapping
      sqlite {{
        schema-name = null

        journal {{
          use-writer-uuid-column = false
          table-name = ""event_journal""
          columns {{
            ordering = ordering
            deleted = is_deleted
            persistence-id = persistence_id
            sequence-number = sequence_nr
            created = timestamp
            tags = tags
            message = payload
            identifier = serializer_id
            manifest = manifest
          }}
        }}

        metadata {{
          table-name = ""journal_metadata""
          columns {{
            persistence-id = persistence_id
            sequence-number = sequence_nr
          }}
        }}
      }}

      # Akka.Persistence.MySql compatibility table name and column name mapping
      mysql {{
        schema-name = null
        journal {{
          use-writer-uuid-column = false
          table-name = ""event_journal""
          columns {{
            ordering = ordering
            deleted = is_deleted
            persistence-id = persistence_id
            sequence-number = sequence_nr
            created = created_at
            tags = tags
            message = payload
            identifier = serializer_id
            manifest = manifest
          }}
        }}

        metadata {{
          table-name = ""metadata""
          columns {{
            persistence-id = persistence_id
            sequence-number = sequence_nr
          }}
        }}
        }}


       }}
       }}


     query {{
       journal {{
         sql {{
           class = ""Akka.Persistence.Sql.Query.SqlReadJournalProvider, Akka.Persistence.Sql""

           # You should specify your proper sql journal plugin configuration path here.
           write-plugin = ""{AkkaPostgreSqlConstants.WriteJournalPluginId}""

           max-buffer-size = 500 # Number of events to buffer at a time.
           refresh-interval = 1s # interval for refreshing

           connection-string = ""{readJournalConnectionString}""

           # This setting dictates how journal event tags are being read from the database.
           # Valid values:
           #   * Csv
           #     This value will make the plugin read event tags from a CSV formatted string
           #     `tags` column inside the journal table. This is the backward compatible
           #     way of reading event tag information.
           #   * TagTable
           #     This value will make the plugin read event tags from the tag
           #     table to improve tag related query speed.
           tag-read-mode = TagTable

           journal-sequence-retrieval {{
             batch-size = 10000
             max-tries = 10
             query-delay = 1s
             max-backoff-query-delay = 60s
             ask-timeout = 1s
           }}

           # Provider name is required.
           # Refer to LinqToDb.ProviderName for values
           # Always use a specific version if possible
           # To avoid provider detection performance penalty
           # Don't worry if your DB is newer than what is listed;
           # Just pick the newest one (if yours is still newer)
           provider-name = ""{LinqToDB.ProviderName.PostgreSQL15}""

           # if set to sqlite, sqlserver, mysql, or postgresql,
           # Column names will be compatible with Akka.Persistence.Sql
           # You still must set your table name!
           table-mapping = postgresql

           # If more entries than this are pending, writes will be rejected.
           # This setting is higher than JDBC because smaller batch sizes
           # Work better in testing and we want to add more buffer to make up
           # For that penalty.
           buffer-size = 5000

           # Batch size refers to the number of items included in a batch to DB
           # JDBC Default is/was 400 but testing against scenarios indicates
           # 100 is better for overall latency. That said,
           # larger batches may be better if you have A fast/local DB.
           batch-size = 100

           # Denotes the number of messages retrieved
           # Per round-trip to DB on recovery.
           # This is to limit both size of dataset from DB (possibly lowering locking requirements)
           # As well as limit memory usage on journal retrieval in CLR
           replay-batch-size = 1000

           # Number of Concurrent writers.
           # On larger servers with more cores you can increase this number
           # But in most cases 2-4 is a safe bet.
           parallelism = 4

           # If a batch is larger than this number,
           # Plugin will utilize Linq2db's
           # Default bulk copy rather than row-by-row.
           # Currently this setting only really has an impact on
           # SQL Server and IBM Informix (If someone decides to test that out)
           # SQL Server testing indicates that under this number of rows, (or thereabouts,)
           # MultiRow is faster than Row-By-Row.
           max-row-by-row-size = 100

           # Only set to TRUE if unit tests pass with the connection string you intend to use!
           # This setting will go away once https://github.com/linq2db/linq2db/issues/2466 is resolved
           use-clone-connection = false

           tag-separator = "";""

           dao = ""Akka.Persistence.Sql.Journal.Dao.ByteArrayJournalDao, Akka.Persistence.Sql""

           # default = akka.persistence.journal.sql.postgresql
           # postgresql = akka.persistence.journal.sql.postgresql

            default = ${{akka.persistence.journal.sql.default}}
            sql-server = ${{akka.persistence.journal.sql.sql-server}}
            sqlite = ${{akka.persistence.journal.sql.sqlite}}
            postgresql = ${{akka.persistence.journal.sql.postgresql}}
            mysql = ${{akka.persistence.journal.sql.mysql}}
         }}
       }}
    }}

    snapshot-store {{
        # Absolute path to the snapshot plugin configuration entry used by
        # persistent actor or view by default.
        # Persistent actor or view can override `snapshotPluginId` method
        # in order to rely on a different snapshot plugin.
        # It is not mandatory to specify a snapshot store plugin.
        # If you don't use snapshots you don't have to configure it.
        # Note that Cluster Sharding is using snapshots, so if you
        # use Cluster Sharding you need to define a snapshot store plugin.
        plugin =  ""{AkkaPostgreSqlConstants.SnapshotPluginId}""

        # List of snapshot stores to start automatically. Use "" for the default snapshot store.
        auto-start-snapshot-stores = [""{AkkaPostgreSqlConstants.SnapshotPluginId}""]

        sharding {{
           class = ""Akka.Persistence.Sql.Snapshot.SqlSnapshotStore, Akka.Persistence.Sql""

            # connection string used for database access
            connection-string = ""{snapshotConnectionString}""

            # separate collections / tables for Akka.Cluster.Sharding
            collection = ""SnapshotStoreSharding""
        }}

        sql {{
        class = ""Akka.Persistence.Sql.Snapshot.SqlSnapshotStore, Akka.Persistence.Sql""
        plugin-dispatcher = ""akka.persistence.dispatchers.default-plugin-dispatcher""
        connection-string = ""{snapshotConnectionString}""

        collection = ""SnapshotStore""

        # Provider name is required.
        # Refer to LinqToDb.ProviderName for values
        # Always use a specific version if possible
        # To avoid provider detection performance penalty
        # Don't worry if your DB is newer than what is listed;
        # Just pick the newest one (if yours is still newer)
        provider-name = ""{LinqToDB.ProviderName.PostgreSQL15}""

        # Only set to TRUE if unit tests pass with the connection string you intend to use!
        # This setting will go away once https://github.com/linq2db/linq2db/issues/2466 is resolved
        use-clone-connection = false

        # The database schema, table names, and column names configuration mapping.
        # The details are described in their respective configuration block below.
        # If set to sqlite, sql-server, mysql, or postgresql,
        # column names will be compatible with Akka.Persistence.Sql
        table-mapping = postgresql

        # Default serializer used as manifest serializer when applicable and payload serializer when
        # no specific binding overrides are specified.
        # If set to null, the default `System.Object` serializer is used.
        serializer = null

        dao = ""Akka.Persistence.Sql.Snapshot.ByteArraySnapshotDao, Akka.Persistence.Sql""

        # if true, tables will attempt to be created.
        auto-initialize = true

        # if true, a warning will be logged
        # if auto-init of tables fails.
        # set to false if you don't want this warning logged
        # perhaps if running CI tests or similar.
        warn-on-auto-init-fail = true

        default {{
            schema-name = public
            snapshot {{
            table-name = ""snapshot_store""
            columns {{
                persistence-id = persistence_id
                sequence-number = sequence_nr
                snapshot = payload
                manifest = manifest
                created = created_at
                serializerId = serializer_id
            }}
            }}
        }}


        postgresql {{
            schema-name = public
            snapshot {{
            table-name = ""snapshot_store""
            columns {{
                persistence-id = persistence_id
                sequence-number = sequence_nr
                snapshot = payload
                manifest = manifest
                created = created_at
                serializerId = serializer_id
            }}
        }}
    }}

  }}
}}
        }}



                   ";
        }

        /* public static Config GetPostgreSqlPersistenceHocon(IServiceProvider serviceProvide)
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
                 .GetSection("PostgreSqlWriteJournalSettings")
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
         }*/

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
