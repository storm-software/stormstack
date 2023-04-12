using Akka.Actor;
using Akka.Cluster.Hosting;
using Akka.Cluster.Sharding;
using Akka.Hosting;
using Akka.Persistence.Hosting;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Akka.Configuration;
using OpenSystem.Akka.Core.Actors;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Reaction.Domain.ValueObjects;
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
                        s =>
                            Props.Create(
                                () =>
                                    new ReactionCommandHandler(serviceProvider, ReactionId.With(s))
                            ),
                    extractor,
                    settings.ShardOptions
                );
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
