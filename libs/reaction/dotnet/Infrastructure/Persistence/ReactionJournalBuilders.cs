namespace OpenSystem.Reaction.Infrastructure.Persistence;

using global::Akka.Persistence.Hosting;
using OpenSystem.Reaction.Infrastructure.Persistence.EventAdapters;

public static class ReactionJournalBuilder
{
    public static Action<AkkaPersistenceJournalBuilder> Tagger = builder =>
        _ = builder.AddEventAdapter<ReactionTaggingEventAdapter>(
            "reaction-tagger",
            new Type[] { typeof(ReactionTaggingEventAdapter) }
        );
}
