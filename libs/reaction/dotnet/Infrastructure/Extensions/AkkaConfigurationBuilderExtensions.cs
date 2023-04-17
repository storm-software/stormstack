using Akka.Actor;
using Akka.Cluster.Hosting;
using Akka.Cluster.Sharding;
using Akka.Hosting;
using Akka.Persistence.Hosting;
using Akka.Streams.Kafka.Settings;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Akka.Configuration;
using OpenSystem.Akka.Core.Actors;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Reaction.Infrastructure.Actors;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    public static class AkkaConfigurationBuilderExtensions
    {
        public static AkkaConfigurationBuilder ConfigureReactionActors(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var extractor = CreateReactionMessageRouter();

            if (settings.UseClustering)
            {
                return builder.WithShardRegion<ReactionCommandHandler>(
                    "reaction",
                    (system, registry, resolver) =>
                        id =>
                            Props.Create(
                                () =>
                                    new ReactionCommandHandler(serviceProvider, ReactionId.With(id))
                            ),
                    extractor,
                    settings.ShardOptions
                );
                /*.WithActors(
                    (system, registry, resolver) =>
                    {
                        var parent = system.ActorOf(
                        ReactionQueryHandler.Props(serviceProvider,
                            extractor,
                            s =>
                            {
                                var id = ReactionId.With(s);
                                var consumerSettings = ConsumerSettings<string, IDomainEvent>
                                    .Create(system, null, null)
                                    .WithBootstrapServers("localhost:29092")
                                    .WithGroupId("group1")
                                    .WithClientId(id.Value)
                                    .WithProperty("session.timeout.ms", "6000");

                                return Props.Create(serviceProvider,
                                            id,


                                );
                            },
                            "reaction-queries"
                        )
                        );

                        registry.Register<ReactionQueryHandler>(parent);
                    }
                );*/
            }
            else
            {
                return builder.WithActors(
                    (system, registry, resolver) =>
                    {
                        var parent = system.ActorOf(
                            GenericChildPerEntityParent.Props(
                                extractor,
                                s =>
                                    Props.Create(
                                        () =>
                                            new ReactionCommandHandler(
                                                serviceProvider,
                                                ReactionId.With(s)
                                            )
                                    )
                            ),
                            "reactions"
                        );
                        registry.Register<ReactionCommandHandler>(parent);
                    }
                );
            }
        }

        public static HashCodeMessageExtractor CreateReactionMessageRouter()
        {
            var extractor = HashCodeMessageExtractor.Create(
                30,
                o =>
                {
                    return o switch
                    {
                        IIndexed<ReactionId> indexed => indexed.Id.ToString(),
                        ShardRegion.StartEntity startEntity => startEntity.EntityId,
                        _ => string.Empty
                    };
                },
                o => o
            );

            return extractor;
        }
    }
}
