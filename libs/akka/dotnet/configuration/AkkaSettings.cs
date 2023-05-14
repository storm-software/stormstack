namespace OpenSystem.Akka.Configuration;

using System.Net;
using global::Akka.Cluster.Hosting;
using global::Akka.Remote.Hosting;

public class AkkaManagementOptions
{
    public bool Enabled { get; set; }

    public string Hostname { get; set; } = Dns.GetHostName();

    public int Port { get; set; } = 8558;

    public string PortName { get; set; } = "management";

    public string ServiceName { get; set; } = "akka-management";

    /// <summary>
    /// Determines the number of nodes we need to make contact with in order to form a cluster initially.
    ///
    /// 3 is a safe default value.
    /// </summary>
    public int RequiredContactPointsNr { get; set; } = 3;

    public DiscoveryMethod DiscoveryMethod { get; set; } = DiscoveryMethod.Config;
}

/// <summary>
/// Determines which Akka.Discovery method to use when discovering other nodes to form and join clusters.
/// </summary>
public enum DiscoveryMethod
{
    Config,
    Kubernetes,
    AwsEcsTagBased,
    AwsEc2TagBased,
    AzureTableStorage
}

public enum PersistenceMode
{
    InMemory,
    Azure,
    PostgreSql,
}

public class AzureStorageSettings
{
    public string ConnectionStringName { get; set; } = "Azurite";
}

public class PostgreSqlStorageSettings
{
    public string JournalConnectionStringName { get; set; } = "PostgreSqlJournal";

    public string SnapshotConnectionStringName { get; set; } = "PostgreSqlSnapshot";
}

public class AkkaSettings
{
    public string ActorSystemName { get; set; } = "AkkaWeb";

    public bool UseClustering { get; set; } = true;

    public bool LogConfigOnStart { get; set; } = true;

    public RemoteOptions RemoteOptions { get; set; } =
        new()
        {
            // can be overridden via config, but is dynamic by default
            PublicHostName = Dns.GetHostName()
        };

    public ClusterOptions ClusterOptions { get; set; } =
        new ClusterOptions()
        {
            // use our dynamic local host name by default
            SeedNodes = new[] { $"akka.tcp://AkkaWebApi@{Dns.GetHostName()}:8082" }
        };

    public ShardOptions ShardOptions { get; set; } = new ShardOptions();

    public string? Name { get; set; }

    public string? Role { get; set; }

    public bool? RecreateOnFailure { get; set; }

    public bool? PreferOldest { get; set; }

    public bool? VerboseDebugLogging { get; set; }

    public PersistenceMode PersistenceMode { get; set; } = PersistenceMode.InMemory;

    public AkkaManagementOptions? AkkaManagementOptions { get; set; }
}
