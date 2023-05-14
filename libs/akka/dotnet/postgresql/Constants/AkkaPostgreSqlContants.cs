namespace OpenSystem.Akka.PostgreSql.Constants;

/// <summary>
/// A list of core cache keys
/// </summary>
public sealed class AkkaPostgreSqlConstants
{
    public const string PluginId = "postgresql";

    public const string WriteJournalPluginId = "akka.persistence.journal.sql";

    public const string ReadJournalPluginId = "akka.persistence.query.journal.sql";

    public const string SnapshotPluginId = "akka.persistence.snapshot-store.sql";
}
