namespace OpenSystem.Akka.Kafka;

public class AkkaKafkaSettings
{
    public string? BootstrapServer { get; set; }

    public string? SchemaRegistry { get; set; }

    public string? SaslUsername { get; set; }

    public string? SaslPassword { get; set; }

    public string? SchemaRegistrySaslUsername { get; set; }

    public string? SchemaRegistrySaslPassword { get; set; }
}
