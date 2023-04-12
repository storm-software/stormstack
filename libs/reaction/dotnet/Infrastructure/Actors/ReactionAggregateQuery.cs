 /*using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Akka.Persistence;
using Akka.Persistence.Query;
using Akka.Streams;
using Akka.Streams.Dsl;
using Akka.Persistence.Query.Sql;

public class ReactionQueryHandler : ReceivePersistentActor
{
    private readonly Dictionary<int, List<string>> reactionsByMessageId =
        new Dictionary<int, List<string>>();

    public override string PersistenceId => "reaction-query-handler";

    public ReactionQueryHandler()
    {
        Command<AddReaction>(message =>
        {
            Persist(
                message,
                _ =>
                {
                    if (!this.reactionsByMessageId.ContainsKey(message.MessageId))
                    {
                        this.reactionsByMessageId[message.MessageId] = new List<string>();
                    }

                    this.reactionsByMessageId[message.MessageId].Add(message.Reaction);
                }
            );
        });

        Command<GetReactions>(message =>
        {
            Sender.Tell(
                this.reactionsByMessageId.GetValueOrDefault(message.MessageId, new List<string>())
            );
        });
    }

    protected override void Recover(object message)
    {
        switch (message)
        {
            case AddReaction addReaction:
                if (!this.reactionsByMessageId.ContainsKey(addReaction.MessageId))
                {
                    this.reactionsByMessageId.Add(addReaction.MessageId, new List<string>());
                }
                this.reactionsByMessageId[addReaction.MessageId].Add(addReaction.Reaction);
                break;

            case SnapshotOffer snapshotOffer:
                this.reactionsByMessageId.Clear();
                this.reactionsByMessageId.AddRange(
                    (Dictionary<int, List<string>>)snapshotOffer.Snapshot
                );
                break;
        }
    }

    protected override void OnRecoveryFailure(Exception reason, object message = null)
    {
        // Handle recovery failure
    }

    protected override void SaveSnapshot(object snapshot)
    {
        DeleteMessages(CurrentPersistenceId, SnapshotMetadata.SequenceNr - 1);
        base.SaveSnapshot(snapshot);
    }

    protected override void OnPersistRejected(Exception exception, object @event, long sequenceNr)
    {
        // Handle persistence rejection
    }

    protected override void OnPersistFailure(Exception cause, object @event, long sequenceNr)
    {
        // Handle persistence failure
    }

    protected override void OnSaveSnapshotFailure(Exception cause, object snapshot)
    {
        // Handle snapshot save failure
    }

    protected override void OnDeleteMessagesSuccess(long toSequenceNr)
    {
        // Handle successful message deletion
    }

    protected override void OnDeleteMessagesFailure(Exception cause, long toSequenceNr)
    {
        // Handle message deletion failure
    }

    protected override bool ReceiveRecover(object message) => true;

    protected override bool ReceiveCommand(object message)
    {
        switch (message)
        {
            case GetPersistenceId getPersistenceId:
                this.Sender.Tell(PersistenceId);
                return true;
            default:
                return base.ReceiveCommand(message);
        }
    }

    protected override void PreStart()
    {
        base.PreStart();

        var readJournal = PersistenceQuery
            .Get(Context.System)
            .ReadJournalFor<SqlReadJournal>(SqlReadJournal.Identifier);

        var queries = new[]
        {
            readJournal.CurrentPersistenceIds(),
            readJournal.EventsByPersistenceId(PersistenceId, 0L, long.MaxValue),
        };

        Source
            .Queue<ICommand[]>(1, OverflowStrategy.Backpressure)
            .SelectMany(async commands =>
            {
                List<Task> tasks = new List<Task>();
                foreach (var command in commands)
                {
                    tasks.Add(RecoverAndHandle(command));
                }

                await Task.WhenAll(tasks);

                return true;
            })
            .To(Sink.Ignore<object>())
            .Run(Context.System.Materializer());

        readJournal.CurrentPersistenceIds()
            .Where(x => x == PersistenceId)
            .SelectMany(x => readJournal.EventsByPersistenceId(PersistenceId, 0L, long.MaxValue))
            .RunForeach(
                @event =>
                {
                    switch (@event.Event)
                    {
                        case AddReaction addReaction:
                            if (!this.reactionsByMessageId.ContainsKey(addReaction.MessageId))
                            {
                                this.reactionsByMessageId.Add(
                                    addReaction.MessageId,
                                    new List<string>()
                                );
                            }
                            this.reactionsByMessageId[addReaction.MessageId].Add(
                                addReaction.Reaction
                            );
                            break;
                    }
                },
                Context.System.Materializer()
            );
    }

   private async Task RecoverAndHandle(ICommand command)
    {
        switch (command)
        {
            case CurrentPersistenceIdsBatch currentBatch:
                foreach (string persistenceId in currentBatch.Ids)
                {
                    await RecoverEvents(persistenceId);
                }
                break;

            case EventsByPersistenceIdBatch eventsBatch:
                foreach (var @event in eventsBatch.Events)
                {
                    await RecoverEvent(@event);
                }
                break;

            default:
                throw new ArgumentException("Invalid command type", nameof(command));
        }
    }

    private async Task RecoverEvents(string persistenceId)
    {
        var readJournal = PersistenceQuery
            .Get(Context.System)
            .ReadJournalFor<SqlReadJournal>(SqlReadJournal.Identifier);

        await readJournal
            .EventsByPersistenceId(persistenceId, 0L, long.MaxValue)
            .RunForeach(
                @event =>
                {
                    switch (@event.Event)
                    {
                        case AddReaction addReaction:
                            if (!this.reactionsByMessageId.ContainsKey(addReaction.MessageId))
                            {
                                this.reactionsByMessageId.Add(
                                    addReaction.MessageId,
                                    new List<string>()
                                );
                            }
                            this.reactionsByMessageId[addReaction.MessageId].Add(
                                addReaction.Reaction
                            );
                            break;
                    }
                },
                Context.System.Materializer()
            );
    }

    private Task RecoverEvent(SelectedSnapshot snapshot) => Task.CompletedTask;

    private Task RecoverEvent(EventEnvelope eventEnvelope) =>
        RecoverEvents(eventEnvelope.PersistenceId);
}*/
