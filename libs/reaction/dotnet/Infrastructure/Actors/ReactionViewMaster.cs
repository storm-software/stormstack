using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Immutable;
using Akka.Actor;
using Akka.Event;
using Akka.Persistence;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Akka.Serilog.Extensions;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Domain.Aggregates;
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
using Akka.Persistence.Sql.Query;
using Akka.Persistence.Query;
using SqlReadJournal = Akka.Persistence.Sql.Query.SqlReadJournal;
using OpenSystem.Reaction.Domain.Events.Models;
using Confluent.SchemaRegistry.Serdes;
using Confluent.SchemaRegistry;
using NotUsed = Akka.NotUsed;
using Akka.Util;
using Confluent.Kafka.SyncOverAsync;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    /// <summary>
    /// Parent actor to all <see cref="PriceVolumeViewActor"/> instances.
    /// </summary>
    public sealed class ReactionViewMaster : ReceiveActor, IWithUnboundedStash
    {
        private IServiceScope _scope;

        private ReactionId _identity;

        private IConfiguration _configuration;

        private SqlReadJournal _readJournal;

        private readonly ILoggingAdapter _logger = Context.GetSerilogLogger();

        public ReactionViewMaster(
            IServiceProvider sp,
            ReactionId identity,
            SqlReadJournal readJournal
        )
        {
            _identity = identity;

            _scope = sp.CreateScope();
            _configuration = _scope.ServiceProvider.GetRequiredService<IConfiguration>();

            _readJournal = readJournal;

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
            var producerSettings = ProducerSettings<Null, ReactionEventMessage>
                .Create(
                    Context.System,
                    null,
                    new AvroSerializer<ReactionEventMessage>(
                        new CachedSchemaRegistryClient(
                            new SchemaRegistryConfig
                            {
                                Url = _configuration
                                    .GetSection("KafkaSettings")
                                    .Get<AkkaKafkaSettings>()
                                    ?.SchemaRegistryUrl
                            }
                        )
                    ).AsSyncOverAsync()
                )
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
                        e.Event is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent>
                        || e.Event
                            is IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent>
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
                                is IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent>
                                    ? 1
                                    : -1
                        }
                    );
                })
                .RunWith(
                    KafkaProducer.PlainSink<Null, ReactionEventMessage>(producerSettings),
                    materializer
                );

            WaitingForSharding();
        }

        public IStash Stash { get; set; }

        private void WaitingForSharding()
        {
            Receive<BeginTrackingReactions>(_ =>
            {
                _logger.Info(
                    "XXXXXXXXXXXXXXXXXXXXX Received access to stock price mediator... Starting pricing views..."
                );

                Become(Running);
                Stash.UnstashAll();
            });

            ReceiveAny(_ => Stash.Stash());
        }

        private void Running()
        {
            _logger.Info(
                "YYYYYYYYYYYYYYYYYYYY Received access to stock price mediator... Starting pricing views..."
            );

            Receive<IDomainEvent>(@event =>
            {
                _logger.Info($"ZZZZZZZZZZZZZZZZZ Event received... [{@event}] - sending to Kafka.");

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
}
