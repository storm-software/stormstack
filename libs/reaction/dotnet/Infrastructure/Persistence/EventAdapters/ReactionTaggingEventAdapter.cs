namespace OpenSystem.Reaction.Infrastructure.Persistence.EventAdapters;

using System.Collections.Immutable;
using global::Akka.Persistence.Journal;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.Events;

public class ReactionTaggingEventAdapter : IEventAdapter
{
    public string Manifest(object evt) => string.Empty;

    public object ToJournal(object evt)
    {
        if (evt is ReactionAddedEvent reactionAddedEvent)
        {
            Console.WriteLine("ReactionTaggingEventAdapter: " + reactionAddedEvent);
            if (reactionAddedEvent.Type == ReactionTypes.Like)
            {
                return new Tagged(evt, ImmutableHashSet.Create("like"));
            }
            else if (reactionAddedEvent.Type == ReactionTypes.Dislike)
            {
                return new Tagged(evt, ImmutableHashSet.Create("dislike"));
            }
            else if (reactionAddedEvent.Type == ReactionTypes.Happy)
            {
                return new Tagged(evt, ImmutableHashSet.Create("happy"));
            }
            else if (reactionAddedEvent.Type == ReactionTypes.Sad)
            {
                return new Tagged(evt, ImmutableHashSet.Create("sad"));
            }
            else if (reactionAddedEvent.Type == ReactionTypes.Laugh)
            {
                return new Tagged(evt, ImmutableHashSet.Create("laugh"));
            }
            else if (reactionAddedEvent.Type == ReactionTypes.Cry)
            {
                return new Tagged(evt, ImmutableHashSet.Create("cry"));
            }
            else
            {
                return evt;
            }
        }
        else
        {
            return evt;
        }
    }

    public IEventSequence FromJournal(object evt, string manifest) => new SingleEventSequence(evt);
}
