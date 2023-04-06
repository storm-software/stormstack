using Akka.Actor;
using Akka.Event;
using Akka.Persistence;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Akka.Serilog.Extensions;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    public sealed class ReactionActor : ReceivePersistentActor
    {
        // currently, do not persist subscribers, but would be easy to add
        private readonly HashSet<IActorRef> _subscribers = new();

        private ReactionAggregate _aggregate;

        private readonly ILoggingAdapter _log = Context.GetSerilogLogger();

        public ReactionActor(ReactionId id)
        {
            // distinguish both type and entity Id in the EventJournal
            PersistenceId = id.ToString();
            _aggregate = new ReactionAggregate(id);

            Recover<SnapshotOffer>(offer =>
            {
                if (offer.Snapshot is ReactionAggregate aggregate)
                {
                    _aggregate = aggregate;
                    _log.Info("Recovered initial value of [{0}]", aggregate);
                }
            });

            Recover<IDomainEvent>(@event =>
            {
                _aggregate = _aggregate.ApplyEvent<ReactionAggregate>(@event);
            });

            Command<GetReactionsCountQuery>(f => Sender.Tell(_aggregate));

            /*Command<SubscribeToCounter>(subscribe =>
            {
                _subscribers.Add(subscribe.Subscriber);
                Sender.Tell(new CounterCommandResponse(_aggregate.CounterId, true));
                Context.Watch(subscribe.Subscriber);
            });

            Command<UnsubscribeToCounter>(counter =>
            {
                Context.Unwatch(counter.Subscriber);
                _subscribers.Remove(counter.Subscriber);
            });*/

            Command<AddReactionCommand>(request =>
            {
                var response = _aggregate.AddReaction(
                    (ReactionTypes)
                        Enum.Parse(typeof(ReactionTypes), request.Payload.Type.ToString(), true)
                );
                if (!response.Failed)
                {
                    Sender.Tell(response);
                    return;
                }

                if (response.DomainEvents != null) // only persist if there is an event to persist
                {
                    PersistAll(
                        response.DomainEvents,
                        @event =>
                        {
                            _aggregate = _aggregate.ApplyEvent<ReactionAggregate>(@event);
                            _log.Info(
                                "Updated counter via {0} - new value is {1}",
                                @event,
                                _aggregate.Id
                            );
                            Sender.Tell(response);

                            // push events to all subscribers
                            foreach (var s in _subscribers)
                            {
                                s.Tell(@event);
                            }
                            SaveSnapshotWhenAble();
                        }
                    );
                }
            });

            Command<SaveSnapshotSuccess>(success =>
            {
                // delete all older snapshots (but leave journal intact, in case we want to do projections with that data)
                DeleteSnapshots(new SnapshotSelectionCriteria(success.Metadata.SequenceNr - 1));
            });
        }

        private void SaveSnapshotWhenAble()
        {
            // save a new snapshot every 25 events, in order to keep recovery times bounded
            if (LastSequenceNr % 25 == 0)
            {
                SaveSnapshot(_aggregate);
            }
        }

        public override string PersistenceId { get; }
    }
}
