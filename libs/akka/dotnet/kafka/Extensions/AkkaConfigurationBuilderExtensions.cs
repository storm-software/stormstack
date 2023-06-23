using Akka.Configuration;
using Akka.Hosting;
using Akka.Streams.Kafka.Settings;

namespace OpenSystem.Akka.Kafka.Extensions
{
    public static class AkkaConfigurationBuilderExtensions
    {
        public static AkkaConfigurationBuilder ConfigureKafkaStreams(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        ) =>
            builder.AddHocon(
                ConfigurationFactory
                    .ParseString(
                        @"
                    akka.suppress-json-serializer-warning=true
                    akka.loglevel = DEBUG
                "
                    )
                    .WithFallback(
                        ConfigurationFactory.FromResource<ConsumerSettings<object, object>>(
                            "Akka.Streams.Kafka.reference.conf"
                        )
                    ),
                HoconAddMode.Prepend
            );
    }
}
