using Akka.Persistence.Hosting;
using OpenSystem.Reaction.Infrastructure.Persistence.EventAdapters;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public static class ReactionJournalBuilder
    {
        public static Action<AkkaPersistenceJournalBuilder> Tagger = builder =>
        {
            builder.AddEventAdapter<ReactionTaggingEventAdapter>(
                "reaction-tagger",
                new Type[] { typeof(ReactionTaggingEventAdapter) }
            );
        };
    }
}
