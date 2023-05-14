namespace OpenSystem.Reaction.Infrastructure.Actors;

using global::Akka.Actor;
using global::Akka.Event;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Akka.Serilog.Extensions;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.ValueObjects;
using global::Akka.Streams.Dsl;
using OpenSystem.Reaction.Domain.Events;
using Microsoft.Extensions.DependencyInjection;
using global::Akka.Streams;
using global::Akka.Streams.Kafka.Dsl;
using global::Akka.Streams.Kafka.Messages;
using global::Akka.Streams.Kafka.Settings;
using Confluent.Kafka;
using OpenSystem.Akka.Kafka;
using Microsoft.Extensions.Configuration;
using SqlReadJournal = global::Akka.Persistence.Sql.Query.SqlReadJournal;
using OpenSystem.Reaction.Domain.Events.Models;
using Confluent.SchemaRegistry.Serdes;
using Confluent.SchemaRegistry;
using Confluent.Kafka.SyncOverAsync;
using OpenSystem.Blog.Reaction.Application.Models;

/// <summary>
/// Parent actor to all <see cref="PriceVolumeViewActor"/> instances.
/// </summary>
public sealed class ReactionViewMaster : ReceiveActor, IWithUnboundedStash
{
    private readonly IServiceScope scope;

    private readonly ReactionId identity;

    private readonly IConfiguration configuration;

    private readonly SqlReadJournal readJournal;

    private readonly ILoggingAdapter logger = Context.GetSerilogLogger();

    public ReactionViewMaster(IServiceProvider sp, ReactionId identity, SqlReadJournal readJournal)
    {
        this.identity = identity;

        this.scope = sp.CreateScope();
        this.configuration = this.scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var kafkaSettings = this.configuration.GetSection("KafkaSettings").Get<AkkaKafkaSettings>();

        this.readJournal = readJournal;

        /*
        new SyncAvroSerializer<ReactionEventMessage>(
                                new CachedSchemaRegistryClient(
                                    new SchemaRegistryConfig
                                    {
                                        Url = _configuration
                                            .GetSection("KafkaSettings")
                                            .Get<AkkaKafkaSettings>()
                                            ?.SchemaRegistryUrl
                                    }
                                )
                            )
        */


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

        _ = this.readJournal
            .EventsByPersistenceId(this.identity.ToString(), 0, long.MaxValue)
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
                        ContentId = this.identity.ToString(),
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

        this.WaitingForSharding();
    }

    public IStash Stash { get; set; }

    private void WaitingForSharding()
    {
        this.Receive<BeginTrackingReactions>(_ =>
        {
            this.logger.Info(
                "XXXXXXXXXXXXXXXXXXXXX Received access to stock price mediator... Starting pricing views..."
            );

            this.Become(this.Running);
            this.Stash.UnstashAll();
        });

        this.ReceiveAny(_ => this.Stash.Stash());
    }

    private void Running()
    {
        logger.Info(
            "YYYYYYYYYYYYYYYYYYYY Received access to stock price mediator... Starting pricing views..."
        );

        Receive<IDomainEvent>(@event =>
        {
            logger.Info($"ZZZZZZZZZZZZZZZZZ Event received... [{@event}] - sending to Kafka.");

            /*using (
                var schemaRegistryClient = new CachedSchemaRegistryClient(
                    new SchemaRegistryConfig
                    {
                        Url = _configuration
                            .GetSection("KafkaSettings")
                            .Get<AkkaKafkaSettings>()
                            ?.SchemaRegistryUrl
                    }
                )
            )
            {
                var serializer = new AvroSerializer<ReactionEventMessage>(
                    schemaRegistryClient
                ).AsSyncOverAsync();
                using (
                    var producer = new ProducerBuilder<Null, ReactionEventMessage>(
                        new ProducerConfig
                        {
                            BootstrapServers = _configuration
                                .GetSection("KafkaSettings")
                                .Get<AkkaKafkaSettings>()
                                ?.BootstrapServer
                        }
                    )
                        .SetValueSerializer(serializer)
                        .Build()
                )
                {
                    var materializer = Context.System.Materializer();
                    var producerSettings = ProducerSettings<Null, ReactionEventMessage>
                        .Create(Context.System, null, serializer)
                        .WithBootstrapServers(
                            _configuration
                                .GetSection("KafkaSettings")
                                .Get<AkkaKafkaSettings>()
                                ?.BootstrapServer
                        );

                    _readJournal
                        .EventsByPersistenceId(_identity.ToString(), 0, long.MaxValue)
                        .Where(
                            e =>
                                e.Event
                                    is IDomainEvent<
                                        ReactionAggregate,
                                        ReactionId,
                                        ReactionAddedEvent
                                    >
                                || e.Event
                                    is IDomainEvent<
                                        ReactionAggregate,
                                        ReactionId,
                                        ReactionRemovedEvent
                                    >
                        )
                        .Select(e =>
                        {
                            if (!(e.Event is IDomainEvent domainEvent))
                                return null;

                            return new ProducerRecord<Null, ReactionEventMessage>(
                                "blog.engagement.reaction.count",
                                new ReactionEventMessage
                                {
                                    Id = _identity.ToString(),
                                    UserId = domainEvent
                                        is IDomainEvent<
                                            ReactionAggregate,
                                            ReactionId,
                                            ReactionAddedEvent
                                        > rae
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
                                        is IDomainEvent<
                                            ReactionAggregate,
                                            ReactionId,
                                            ReactionAddedEvent
                                        >
                                            ? 1
                                            : -1
                                }
                            );
                        })
                        .RunWith(
                            KafkaProducer.PlainSink<Null, ReactionEventMessage>(
                                producerSettings,
                                producer
                            ),
                            materializer
                        );*/

            //producer.Flush(TimeSpan.FromSeconds(30));

            /*.Recover(exception =>
            {
                _logger.Error(
                    "!!!!!!!!!!!!!!! Error occurred during processing !!!!!!!!!!!!!!!"
                );
                _logger.Error(exception.ToString());

                return Option<IEnvelope<string, ReactionEventMessage, NotUsed>>.None;
            })
            .Via(
                KafkaProducer.FlexiFlow<string, ReactionEventMessage, NotUsed>(
                    producerSettings,
                    producer
                )
            )
            .RunWith(
                Sink.Ignore<IResults<string, ReactionEventMessage, NotUsed>>(),
                materializer
            );*/
            //      }
            //  }

            /*_streamSource
                .Via(KafkaProducer.FlexiFlow<string, string, NotUsed>(_producerSettings))
                .RunWith(Sink.Ignore<IResults<string, string, NotUsed>>(), _materializer);*/

            // Goes to deadletters if stock ticker symbol does not exist.
            //child.Forward(w);
        });

        /*Receive<IWithStockId>(w =>
        {
            var child = Context.Child(w.StockId);
            if (child.IsNobody())
            {
                _logger.Warning(
                    "Message received for unknown ticker symbol [{0}] - sending to dead letters.",
                    w.StockId
                );
            }

            // Goes to deadletters if stock ticker symbol does not exist.
            child.Forward(w);
        });*/

        /* Receive<ReactionEventMessage>(@event =>
         {
             /*var child = Context.Child(w.StockId);
             if (child.IsNobody())
             {
                 _logger.Warning(
                     "Message received for unknown ticker symbol [{0}] - sending to dead letters.",
                     w.StockId
                 );
             }*/

        // Goes to deadletters if stock ticker symbol does not exist.
        //child.Forward(w);
        //});
    }

    public class BeginTrackingReactions
    {
        public BeginTrackingReactions() { }
    }
}
