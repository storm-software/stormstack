using Akka.Configuration;
using System.Diagnostics;
using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Akka.Actor;
using Akka.Hosting;
using Akka.Streams.Kafka;
using Akka;
using Akka.Actor;
using Akka.Configuration;
using Akka.Streams;
using Akka.Streams.Dsl;
using Akka.Streams.Kafka.Dsl;
using Akka.Streams.Kafka.Messages;
using Akka.Streams.Kafka.Settings;
using Confluent.Kafka;
using Config = Akka.Configuration.Config;

namespace OpenSystem.Akka.Kafka.Extensions
{
    public static class AkkaConfigurationBuilderExtensions
    {
        public static AkkaConfigurationBuilder ConfigureKafkaStreams(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {
            return builder.AddHocon(
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
}
