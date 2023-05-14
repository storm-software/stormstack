namespace OpenSystem.Reaction.Infrastructure.Extensions;

using global::Akka.Actor;
using global::Akka.Cluster.Hosting;
using global::Akka.Cluster.Sharding;
using global::Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Akka.Configuration;
using OpenSystem.Akka.Core.Actors;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Reaction.Infrastructure.Actors;

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
                    {
                        var reactionId = ReactionId.With(id);

                        /*var readJournal = PersistenceQuery
                            .Get(system)
                            .ReadJournalFor<SqlReadJournal>(
                                AkkaPostgreSqlConstants.ReadJournalPluginId
                            );

                        var reactionViewMaster = system.ActorOf(
                            Props.Create(
                                () =>
                                    new ReactionViewMaster(serviceProvider, reactionId, readJournal)
                            ),
                            $"pub-{reactionId.Value}"
                        );
                        registry.Register<ReactionViewMaster>(reactionViewMaster);*/

                        var propsFactory = Props.Create(
                            () => new ReactionCommandHandler(serviceProvider, reactionId)
                        );

                        // reactionViewMaster.Tell(new ReactionViewMaster.BeginTrackingReactions());

                        return propsFactory;
                    },
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
                            id =>
                            {
                                var reactionId = ReactionId.With(id);

                                /* var readJournal = PersistenceQuery
                                     .Get(system)
                                     .ReadJournalFor<SqlReadJournal>(
                                         AkkaPostgreSqlConstants.ReadJournalPluginId
                                     );

                                 var reactionViewMaster = system.ActorOf(
                                     Props.Create(
                                         () =>
                                             new ReactionViewMaster(
                                                 serviceProvider,
                                                 reactionId,
                                                 readJournal
                                             )
                                     ),
                                     $"pub-{reactionId.Value}"
                                 );
                                 registry.Register<ReactionViewMaster>(reactionViewMaster);*/

                                var propsFactory = Props.Create(
                                    () => new ReactionCommandHandler(serviceProvider, reactionId)
                                );

                                /* reactionViewMaster.Tell(
                                     new ReactionViewMaster.BeginTrackingReactions()
                                 );*/

                                return propsFactory;
                            }
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
                o switch
                {
                    IIndexed<ReactionId> indexed => indexed.Id.ToString(),
                    ShardRegion.StartEntity startEntity => startEntity.EntityId,
                    _ => string.Empty
                },
            o => o
        );

        return extractor;
    }
}
