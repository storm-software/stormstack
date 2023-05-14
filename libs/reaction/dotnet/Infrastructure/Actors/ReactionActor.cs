namespace OpenSystem.Reaction.Infrastructure.Actors;

using global::Akka.Actor;
using global::Akka.Event;
using global::Akka.Persistence;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Akka.Serilog.Extensions;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Akka.PostgreSql.Constants;
using global::Akka.Streams.Dsl;
using OpenSystem.Reaction.Domain.Events;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.ResultCodes;
using global::Akka.Streams;
using global::Akka.Streams.Kafka.Dsl;
using global::Akka.Streams.Kafka.Messages;
using global::Akka.Streams.Kafka.Settings;
using Confluent.Kafka;
using OpenSystem.Akka.Kafka;
using Microsoft.Extensions.Configuration;
using global::Akka.Persistence.Query;
using SqlReadJournal = global::Akka.Persistence.Sql.Query.SqlReadJournal;
using Confluent.SchemaRegistry.Serdes;
using Confluent.SchemaRegistry;
using OpenSystem.Blog.Reaction.Application.Models;
using Confluent.Kafka.SyncOverAsync;

public sealed class ReactionCommandHandler : ReceivePersistentActor
{
    public override string? PersistenceId { get; }

    // currently, do not persist subscribers, but would be easy to add
    private readonly HashSet<IActorRef> subscribers = new();

    private readonly IDomainEventFactory domainEventFactory;

    private ReactionAggregate aggregate;

    private readonly IConfiguration configuration;

    private readonly IServiceScope scope;

    private readonly ILoggingAdapter logger = Context.GetSerilogLogger();

    public ReactionCommandHandler(IServiceProvider sp, ReactionId id)
    {
        this.scope = sp.CreateScope();

        this.aggregate = new ReactionAggregate(id);
        this.PersistenceId = this.aggregate.GetIdentity().ToString();

        this.configuration = this.scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var kafkaSettings = this.configuration.GetSection("KafkaSettings").Get<AkkaKafkaSettings>();

        var materializer = Context.System.Materializer();
        var producerSettings = ProducerSettings<Null, ReactionEventValues>
            .Create(
                Context.System,
                null,
                new AvroSerializer<ReactionEventValues>(
                    new CachedSchemaRegistryClient(
                        new SchemaRegistryConfig
                        {
                            Url = kafkaSettings?.SchemaRegistry,
                            BasicAuthUserInfo =
                                $"{kafkaSettings?.SchemaRegistrySaslUsername}:{kafkaSettings?.SchemaRegistrySaslPassword}"
                        }
                    )
                ).AsSyncOverAsync()
            )
            .WithBootstrapServers(kafkaSettings?.BootstrapServer)
            .WithProducerConfig(
                new ProducerConfig
                {
                    SaslUsername = kafkaSettings?.SaslUsername,
                    SaslPassword = kafkaSettings?.SaslPassword,
                    SaslMechanism = SaslMechanism.Plain,
                    SecurityProtocol = SecurityProtocol.SaslSsl,
                }
            );

        _ = PersistenceQuery
            .Get(Context.System)
            .ReadJournalFor<SqlReadJournal>(AkkaPostgreSqlConstants.ReadJournalPluginId)
            .EventsByPersistenceId(this.PersistenceId, 0, long.MaxValue)
            .Where(
                e =>
                    e.Event
                        is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent>
                            or IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent>
            )
            .Select(e =>
            {
                this.logger.Info(
                    "PSPSPSPSPSPSPSPS Received access to stock price mediator... Starting pricing views..."
                );
                if (e.Event is not IDomainEvent domainEvent)
                {
                    return null;
                }

                return new ProducerRecord<Null, ReactionEventValues>(
                    "blog.reaction",
                    new ReactionEventValues
                    {
                        ContentId = this.PersistenceId,
                        UserId = domainEvent
                            is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> rae
                            ? rae.AggregateEvent.UserId
                            : domainEvent
                                is IDomainEvent<
                                    ReactionAggregate,
                                    ReactionId,
                                    ReactionRemovedEvent
                                > rre
                                ? rre.AggregateEvent.UserId
                                : string.Empty,
                        Type = ReactionTypes.Like,
                        Count =
                            e.Event
                            is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent>
                                ? 1
                                : -1
                    }
                );
            })
            .RunWith(KafkaProducer.PlainSink(producerSettings), materializer);

        this.domainEventFactory =
            this.scope.ServiceProvider.GetRequiredService<IDomainEventFactory>();

        this.Recover<SnapshotOffer>(offer =>
        {
            if (offer.Snapshot is ReactionAggregate aggregate)
            {
                this.aggregate = aggregate;
                this.logger.Info("Recovered initial value of [{0}]", aggregate);
            }
        });

        this.Recover<IDomainEvent>(
            @event => this.aggregate = this.aggregate.ApplyEvent<ReactionAggregate>(@event)
        );

        this.Command<GetReactionsCountQuery>(f => this.Sender.Tell(this.aggregate));

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

        this.Command<AddReactionCommand>(request =>
        {
            var response = this.aggregate.AddReaction(
                request.UserId,
                (Domain.Enums.ReactionTypes)
                    Enum.Parse(
                        typeof(Domain.Enums.ReactionTypes),
                        request.Payload.Type.ToString(),
                        true
                    )
            );
            if (response?.Succeeded != true)
            {
                this.Sender.Tell(response);
                return;
            }

            this.Sender.Tell(Result.Success(this.aggregate.Id, this.aggregate.Version + 1));

            if (this.aggregate.UncommittedEvents != null && this.aggregate.UncommittedEvents.Any())
            {
                this.PersistAll(
                    this.domainEventFactory.Create(this.aggregate.UncommittedEvents),
                    @event =>
                    {
                        this.aggregate = this.aggregate.ApplyEvent<ReactionAggregate>(@event);
                        this.logger.Info(
                            "Updated aggregate via {0} - new value is {1}",
                            @event,
                            this.aggregate.Id
                        );

                        // push events to all subscribers
                        foreach (var subscriber in this.subscribers)
                        {
                            subscriber.Tell(@event);
                        }

                        this.SaveSnapshotWhenAble();
                    }
                );
                this.aggregate.ClearUncommittedEvents();
            }
        });

        this.Command<UpdateReactionCommand>(request =>
        {
            var response = this.aggregate.UpdateReaction(
                request.UserId,
                (Domain.Enums.ReactionTypes)
                    Enum.Parse(
                        typeof(Domain.Enums.ReactionTypes),
                        request.Payload.Type.ToString(),
                        true
                    )
            );
            if (response?.Succeeded != true)
            {
                this.Sender.Tell(response);
                return;
            }

            this.Sender.Tell(Result.Success(this.aggregate.Id, this.aggregate.Version + 1));

            if (this.aggregate.UncommittedEvents != null && this.aggregate.UncommittedEvents.Any())
            {
                this.PersistAll(
                    this.domainEventFactory.Create(this.aggregate.UncommittedEvents),
                    @event =>
                    {
                        this.aggregate = this.aggregate.ApplyEvent<ReactionAggregate>(@event);
                        this.logger.Info(
                            "Updated aggregate via {0} - new value is {1}",
                            @event,
                            this.aggregate.Id
                        );

                        // push events to all subscribers
                        foreach (var subscriber in this.subscribers)
                        {
                            subscriber.Tell(@event);
                        }
                        this.SaveSnapshotWhenAble();
                    }
                );
                this.aggregate.ClearUncommittedEvents();
            }
        });

        this.Command<RemoveReactionCommand>(request =>
        {
            var response = this.aggregate.RemoveReaction(request.UserId);
            if (response?.Succeeded != true)
            {
                this.Sender.Tell(response);
                return;
            }

            this.Sender.Tell(Result.Success(this.aggregate.Id, this.aggregate.Version + 1));

            if (this.aggregate.UncommittedEvents != null && this.aggregate.UncommittedEvents.Any())
            {
                this.PersistAll(
                    this.domainEventFactory.Create(this.aggregate.UncommittedEvents),
                    @event =>
                    {
                        this.aggregate = this.aggregate.ApplyEvent<ReactionAggregate>(@event);
                        this.logger.Info(
                            "Updated aggregate via {0} - new value is {1}",
                            @event,
                            this.aggregate.Id
                        );

                        // push events to all subscribers
                        foreach (var subscriber in this.subscribers)
                        {
                            subscriber.Tell(@event);
                        }
                        this.SaveSnapshotWhenAble();
                    }
                );
                this.aggregate.ClearUncommittedEvents();
            }
        });

        this.Command<SaveSnapshotSuccess>(
            success =>
                // delete all older snapshots (but leave journal intact, in case we want to do projections with that data)
                this.DeleteSnapshots(new SnapshotSelectionCriteria(success.Metadata.SequenceNr - 1))
        );
    }

    public override void AroundPreStart()
    {
        this.logger.Info($"Starting actor {this.GetType().Name} - {this.PersistenceId}");
        base.AroundPreStart();
    }

    public override void AroundPostStop()
    {
        this.logger.Info("Stopping actor  {this.GetType().Name} - {this.PersistenceId}");
        base.AroundPreStart();
    }

    private void SaveSnapshotWhenAble()
    {
        // save a new snapshot every 25 events, in order to keep recovery times bounded
        if (this.LastSequenceNr % 25 == 0)
        {
            this.SaveSnapshot(this.aggregate);
        }
    }
}
