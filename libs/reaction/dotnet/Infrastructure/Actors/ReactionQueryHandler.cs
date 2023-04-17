using System.Collections.Generic;
using System.Linq;
using Akka;
using Akka.Actor;
using Akka.Event;
using Akka.Persistence;
using Akka.Persistence.Query;
using Akka.Streams;
using Akka.Streams.Dsl;
using Akka.Persistence.Query.Sql;
using Akka.Streams.Kafka.Dsl;
using Akka.Streams.Kafka.Helpers;
using Akka.Streams.Kafka.Messages;
/*using Akka.Streams.Kafka.Settings;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Akka.Serilog.Extensions;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.ReadStores;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Reaction.Domain.ValueObjects;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using static Akka.Actor.Props;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    public class ReactionQueryHandler : ReceiveActor
    {
        public static Props Props(
            IServiceProvider sp,
            ReactionId id,
            ConsumerSettings<string, IDomainEvent> settings,
            ISubscription subscription
        ) => Create(() => new ReactionQueryHandler(sp, id, settings,  Subscriptions.Topics(
                                                    new string[]
                                                    {
                                                        typeof(ReactionAddedEvent).Name,
                                                        typeof(ReactionRemovedEvent).Name
                                                    }
                                                )));

        private readonly ConsumerSettings<string, IDomainEvent> _settings;

        private readonly ISubscription _subscription;

        private DrainingControl<NotUsed> _control;

        private ReactionReadModel _readModel;

        private IServiceScope _scope;

        private ReactionId _reactionId;

        private readonly ILoggingAdapter _logger = Context.GetSerilogLogger();

        public ReactionQueryHandler(
            IServiceProvider sp,
            ReactionId id,
            ConsumerSettings<string, IDomainEvent> settings,
            ISubscription subscription
        )
        {
            _scope = sp.CreateScope();

            // distinguish both type and entity Id in the EventJournal
            // _domainEventFactory = _scope.ServiceProvider.GetRequiredService<IDomainEventFactory>();
            /*_readModelDomainEventApplier =
                _scope.ServiceProvider.GetRequiredService<IReadModelDomainEventApplier>();

            _readModelFactory = _scope.ServiceProvider.GetRequiredService<
                IReadModelFactory<ReactionReadModel>
            >();*/

/*_reactionId = id;
_readModel = new ReactionReadModel(_reactionId.Value);

_settings = settings;
_subscription = subscription;

Receive<CommittableMessage<string, IDomainEvent>>(msg =>
{
    var record = msg.Record;
    _logger.Info(
        $"{record.Topic}[{record.Partition}][{record.Offset}]: {record.Message.Value}"
    );
    Sender.Tell(msg.CommitableOffset);
});

Receive<ReactionReadModel>(readModel => _readModel = readModel);

Receive<GetReactionByIdQuery>(request =>
{
    Sender.Tell(Result.Success(_readModel));
});
}

protected override void PostRestart(Exception reason)
{
base.PostRestart(reason);
_logger.Info("Worker restarted");
}

protected override void PreStart()
{
base.PreStart();

var committerDefaults = CommitterSettings
    .Create(Context.System)
    .WithMaxInterval(TimeSpan.FromMilliseconds(500));

KafkaConsumer
    .PlainSource(_settings, _subscription)
    .GroupBy(
        Enum.GetValues(typeof(ReactionTypes)).Length,
        e =>
            e.Message.Value
                is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> rae
                ? rae.AggregateEvent.Type
                : e.Message.Value
                    is IDomainEvent<
                        ReactionAggregate,
                        ReactionId,
                        ReactionRemovedEvent
                    > rre
                    ? rre.AggregateEvent.Type
                    : ReactionTypes.Like
    )
    .Aggregate(
        new ReactionTypeReadModel(),
        (acc, next) =>
        {
            if (
                next.Message.Value
                is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> rae
            )
                acc.Apply(rae);
            else if (
                next.Message.Value
                is IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent> rre
            )
                acc.Apply(rre);

            return acc;
        }
    )
    .RunWith(
        Sink.Aggregate<ReactionTypeReadModel, ReactionReadModel>(
            new ReactionReadModel(_reactionId.Value),
            (acc, next) =>
            {
                acc.Types.Add(next);
                return acc;
            }
        ),
        Context.Materializer()
    )
    .PipeTo<ReactionReadModel>(Self, true, Self);

/*.CommittableSource(_settings, _subscription).
.Ask<ICommittable>(Self, TimeSpan.FromSeconds(1), 1)
.ToMaterialized(Committer.Sink(committerDefaults), DrainingControl<NotUsed>.Create)
.Run(Context.System.Materializer());*/
/*  _logger.Info("Worker started");
}

protected override void PostStop()
{
  base.PostStop();
  _control?.Shutdown().Wait();
  _logger.Info("Worker stopped");
}
}
}*/
