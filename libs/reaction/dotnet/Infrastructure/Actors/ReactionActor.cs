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
using OpenSystem.Akka.PostgreSql.Constants;
using Akka.Streams.Dsl;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Reaction.Application.ReadStores;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.ResultCodes;
using Akka.Streams;
using Akka.Streams.Dsl;
using Akka.Streams.Kafka.Dsl;
using Akka.Streams.Kafka.Messages;
using Akka.Streams.Kafka.Settings;
using Confluent.Kafka;
using Config = Akka.Configuration.Config;
using OpenSystem.Akka.Kafka;
using Microsoft.Extensions.Configuration;
using Akka.Persistence.Query;
using SqlReadJournal = Akka.Persistence.Sql.Query.SqlReadJournal;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    public sealed class ReactionCommandHandler : ReceivePersistentActor
    {
        public override string? PersistenceId { get; }

        // currently, do not persist subscribers, but would be easy to add
        private readonly HashSet<IActorRef> _subscribers = new();

        private readonly IDomainEventFactory _domainEventFactory;

        private readonly IReadModelFactory<ReactionReadModel> _readModelFactory;

        private readonly IReadModelDomainEventApplier _readModelDomainEventApplier;

        private ReactionAggregate _aggregate;

        private SqlReadJournal _readJournal;

        private IServiceScope _scope;

        private readonly ILoggingAdapter _logger = Context.GetSerilogLogger();

        public ReactionCommandHandler(IServiceProvider sp, ReactionId id)
        {
            _scope = sp.CreateScope();

            // distinguish both type and entity Id in the EventJournal


            _domainEventFactory = _scope.ServiceProvider.GetRequiredService<IDomainEventFactory>();
            /*_readModelDomainEventApplier =
                _scope.ServiceProvider.GetRequiredService<IReadModelDomainEventApplier>();

            _readModelFactory = _scope.ServiceProvider.GetRequiredService<
                IReadModelFactory<ReactionReadModel>
            >();*/
            //_readModel = new ReactionReadModel(id.Value);

            _aggregate = new ReactionAggregate(id);
            PersistenceId = _aggregate.GetIdentity().ToString();

            var configuration = _scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var kafkaSettings = configuration.GetSection("KafkaSettings").Get<AkkaKafkaSettings>();

            /*var producerSettings = ProducerSettings<string, string>
                .Create(Context.System, null, null)
                .WithBootstrapServers(kafkaSettings?.BootstrapServer);*/

            Recover<SnapshotOffer>(offer =>
            {
                if (offer.Snapshot is ReactionAggregate aggregate)
                {
                    _aggregate = aggregate;
                    _logger.Info("Recovered initial value of [{0}]", aggregate);
                }
            });

            Recover<IDomainEvent>(@event =>
            {
                _aggregate = _aggregate.ApplyEvent<ReactionAggregate>(@event);
            });

            Command<GetReactionsCountQuery>(f => Sender.Tell(_aggregate));

            // Add read journal to the actor system and get a reference to it
            _readJournal = PersistenceQuery
                .Get(Context.System)
                .ReadJournalFor<SqlReadJournal>(AkkaPostgreSqlConstants.ReadJournalPluginId);
            var mat = ActorMaterializer.Create(Context.System);

            var producerSettings = ProducerSettings<string, string>
                .Create(Context.System, null, null)
                .WithBootstrapServers(kafkaSettings?.BootstrapServer);

            var eventStream = _readJournal
                .EventsByPersistenceId(PersistenceId, 0, long.MaxValue)
                .Where(
                    e =>
                        e.Event is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent>
                        || e.Event
                            is IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent>
                )
                .Select(e => new ProducerRecord<string, string>("reactions", e.ToString()));

            /*     ..MergeMaterialized(
                     Sink.Aggregate<ReactionTypeReadModel, ReactionReadModel>(
                         new ReactionReadModel(PersistenceId),
                         (acc, next) =>
                         {
                             acc.Types.Add(next);
                             return acc;
                         }
                     ),
                     mat
                 );


                 .Run(
                     Sink.Aggregate<ReactionTypeReadModel, ReactionReadModel>(
                         new ReactionReadModel(PersistenceId),
                         (acc, next) =>
                         {
                             acc.Types.Add(next);
                             return acc;
                         }
                     ),
                     mat
                 )
                 .PipeTo<ReactionReadModel>(Self);*/

            /*.Select(e => new ProducerRecord<string, string>(e.Event.ToString(), e.ToString()))
            .RunWith(KafkaProducer.PlainSink(producerSettings), mat);*/

            /*.Select(elem => ProducerMessage.Single(new ProducerRecord<string, string>(PersistenceId, $"key-{elem}", elem)))
                .Via(KafkaProducer.FlexiFlow<string, string, NotUsed>(producerSettings))*/

            // run the query and subscribe to the stream
            /*var types = query

                .GroupBy(
                    Enum.GetValues(typeof(ReactionTypes)).Length,
                    e =>
                        e.Event
                            is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> rae
                            ? rae.AggregateEvent.Type
                            : e.Event
                                is IDomainEvent<
                                    ReactionAggregate,
                                    ReactionId,
                                    ReactionRemovedEvent
                                > rre
                                ? rre.AggregateEvent.Type
                                : ReactionTypes.Like
                );*/

            /*var readModelStream = types.Aggregate(
                new ReactionTypeReadModel(),
                (acc, next) =>
                {
                    if (
                        next.Event
                        is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> rae
                    )
                        acc.Apply(rae);
                    else if (
                        next.Event
                        is IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent> rre
                    )
                        acc.Apply(rre);

                    return acc;
                }
            );*/

            /* Command<GetReactionByIdQuery>(
                 request =>
                 {
                     types
                         .Aggregate(
                             new ReactionTypeReadModel(),
                             (acc, next) =>
                             {
                                 if (
                                     next.Event
                                     is IDomainEvent<
                                         ReactionAggregate,
                                         ReactionId,
                                         ReactionAddedEvent
                                     > rae
                                 )
                                     acc.Apply(rae);
                                 else if (
                                     next.Event
                                     is IDomainEvent<
                                         ReactionAggregate,
                                         ReactionId,
                                         ReactionRemovedEvent
                                     > rre
                                 )
                                     acc.Apply(rre);

                                 return acc;
                             }
                         )
                         .RunWith(
                             Sink.Aggregate<ReactionTypeReadModel, ReactionReadModel>(
                                 new ReactionReadModel(PersistenceId),
                                 (acc, next) =>
                                 {
                                     acc.Types.Add(next);
                                     return acc;
                                 }
                             ),
                             mat
                         )
                         .PipeTo<ReactionReadModel>(
                             Sender,
                             true,
                             Self,
                             e => Result.Success(e),
                             e => Result.Failure(e)
                         );
                 },
                 request => string.IsNullOrEmpty(request.Type)
             );*/

            Command<GetReactionByIdQuery>(request =>
            {
                if (_readJournal == null)
                {
                    Sender.Tell(
                        Result.Failure(typeof(ResultCodeGeneral), ResultCodeGeneral.GeneralError)
                    );
                    return;
                }

                eventStream.RunWith(KafkaProducer.PlainSink(producerSettings), mat);

                Sender.Tell(Result.Success());

                /*.RunWith(
                    Sink.Aggregate<EventEnvelope, ReactionReadModel>(
                        new ReactionReadModel(PersistenceId),
                        (acc, next) =>
                        {
                            if (
                                next.Event
                                is IDomainEvent<
                                    ReactionAggregate,
                                    ReactionId,
                                    ReactionAddedEvent
                                > rae
                            )
                                acc.Apply(rae);
                            else if (
                                next.Event
                                is IDomainEvent<
                                    ReactionAggregate,
                                    ReactionId,
                                    ReactionRemovedEvent
                                > rre
                            )
                                acc.Apply(rre);
                            _logger.Info("**** Accumulating ^^^^^^ {0}", acc);
                            return acc;
                        }
                    ),
                    mat
                )
                .RunAggregate(
                    new ReactionReadModel(PersistenceId),
                    (acc, next) =>
                    {
                        if (
                            next.Event
                            is IDomainEvent<
                                ReactionAggregate,
                                ReactionId,
                                ReactionAddedEvent
                            > rae
                        )
                            acc.Apply(rae);
                        else if (
                            next.Event
                            is IDomainEvent<
                                ReactionAggregate,
                                ReactionId,
                                ReactionRemovedEvent
                            > rre
                        )
                            acc.Apply(rre);
                        _logger.Info("**** Accumulating ^^^^^^ {0}", acc);
                        return acc;
                    },
                    mat
                )
                .PipeTo<ReactionReadModel>(
                    Self,
                    Sender,
                    readModel =>
                    {
                        _logger.Info(" ^^^^^^ PipeTo {0} ^^^^^^", readModel);
                        Sender.Tell(Result.Success(readModel));

                        return readModel;
                    }
                );*/
            });

            /*Command<SubscribeToCounter>(subscribe =>
            {
                _subscribers.Add(subscribe.Subscriber);
                Sender.Tell(new CounterCommandResponse(_aggregate.CounterId, true));
                Context.Watch(subscribe.Subscriber);
            });

            Command<UnsubscribeToCounter>(unsubscribe =>
            {
                Context.Unwatch(unsubscribe.Subscriber);
                _subscribers.Remove(unsubscribe.Subscriber);
            });*/

            Command<AddReactionCommand>(request =>
            {
                var response = _aggregate.AddReaction(
                    request.UserId,
                    (ReactionTypes)
                        Enum.Parse(typeof(ReactionTypes), request.Payload.Type.ToString(), true)
                );
                if (response?.Succeeded != true)
                {
                    Sender.Tell(response);
                    return;
                }

                Sender.Tell(Result.Success(_aggregate.Id, _aggregate.Version + 1));

                if (
                    _aggregate.UncommittedEvents != null && _aggregate.UncommittedEvents.Count() > 0
                )
                {
                    PersistAll(
                        _domainEventFactory.Create(_aggregate.UncommittedEvents),
                        @event =>
                        {
                            _aggregate = _aggregate.ApplyEvent<ReactionAggregate>(@event);
                            _logger.Info(
                                "Updated aggregate via {0} - new value is {1}",
                                @event,
                                _aggregate.Id
                            );

                            // push events to all subscribers
                            foreach (var subscriber in _subscribers)
                            {
                                subscriber.Tell(@event);
                            }
                            SaveSnapshotWhenAble();
                        }
                    );
                    _aggregate.ClearUncommittedEvents();
                }
            });

            Command<RemoveReactionCommand>(request =>
            {
                var response = _aggregate.RemoveReaction(request.UserId);
                if (response?.Succeeded != true)
                {
                    Sender.Tell(response);
                    return;
                }

                Sender.Tell(Result.Success(_aggregate.Id, _aggregate.Version + 1));

                if (_aggregate.UncommittedEvents != null && _aggregate.UncommittedEvents.Any())
                {
                    PersistAll(
                        _domainEventFactory.Create(_aggregate.UncommittedEvents),
                        @event =>
                        {
                            _aggregate = _aggregate.ApplyEvent<ReactionAggregate>(@event);
                            _logger.Info(
                                "Updated aggregate via {0} - new value is {1}",
                                @event,
                                _aggregate.Id
                            );

                            // push events to all subscribers
                            foreach (var subscriber in _subscribers)
                            {
                                subscriber.Tell(@event);
                            }
                            SaveSnapshotWhenAble();
                        }
                    );
                    _aggregate.ClearUncommittedEvents();
                }
            });

            Command<SaveSnapshotSuccess>(success =>
            {
                // delete all older snapshots (but leave journal intact, in case we want to do projections with that data)
                DeleteSnapshots(new SnapshotSelectionCriteria(success.Metadata.SequenceNr - 1));
            });
        }

        /*protected override bool Receive(object message)
        {
            _logger.Info("Message received: {0}", message);


            if (message is ReactionReadModel reactionReadModel)
                _readModel = reactionReadModel;

            return base.Receive(message);
        }*/

        public override void AroundPreStart()
        {
            _logger.Info("Starting up");
            /*_readModelFactory
                .CreateAsync(PersistenceId, new CancellationToken())
                .ContinueWith(t =>
                {
                    _readModel = t.Result;
                    _logger.Info("Recovered initial value of [{0}]", _readModel);
                });*/

            base.AroundPreStart();
        }

        public override void AroundPostStop()
        {
            _logger.Info("Stopping actor");
            base.AroundPreStart();
        }

        private void SaveSnapshotWhenAble()
        {
            // save a new snapshot every 25 events, in order to keep recovery times bounded
            if (LastSequenceNr % 25 == 0)
            {
                SaveSnapshot(_aggregate);
            }
        }
    }
}
