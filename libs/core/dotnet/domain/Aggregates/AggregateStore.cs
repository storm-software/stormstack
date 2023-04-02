using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Aggregates
{
    public class AggregateStore : IAggregateStore
    {
        private static readonly IReadOnlyCollection<IDomainEvent> EmptyDomainEventCollection =
            new IDomainEvent[] { };
        private readonly ILogger<AggregateStore> _logger;

        private readonly IServiceProvider _serviceProvider;

        private readonly IAggregateFactory _aggregateFactory;

        private readonly IEventStore _eventStore;

        /*private readonly ISnapshotStore _snapshotStore;*/

        private readonly ICancellationSettings _cancellationConfiguration;

        private readonly IAggregateStoreResilienceStrategy _aggregateStoreResilienceStrategy;

        private readonly ITransientFaultHandler<IOptimisticConcurrencyRetryStrategy> _transientFaultHandler;

        private readonly EventSourcingSettings _configuration;

        public AggregateStore(
            ILogger<AggregateStore> logger,
            IServiceProvider serviceProvider,
            IAggregateFactory aggregateFactory,
            IEventStore eventStore,
            ITransientFaultHandler<IOptimisticConcurrencyRetryStrategy> transientFaultHandler,
            IAggregateStoreResilienceStrategy aggregateStoreResilienceStrategy,
            ICancellationSettings cancellationConfiguration,
            EventSourcingSettings configuration
        /*ISnapshotStore snapshotStore*/
        )
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _aggregateFactory = aggregateFactory;
            _eventStore = eventStore;
            _transientFaultHandler = transientFaultHandler;
            _aggregateStoreResilienceStrategy = aggregateStoreResilienceStrategy;
            _cancellationConfiguration = cancellationConfiguration;
            _configuration = configuration;

            /*_snapshotStore = snapshotStore;*/
        }

        public async Task<TAggregate> LoadAsync<TAggregate, TIdentity>(
            TIdentity id,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            var aggregate = await _aggregateFactory
                .CreateNewAggregateAsync<TAggregate, TIdentity>(id)
                .ConfigureAwait(false);
            await aggregate
                .LoadAsync(
                    _eventStore, /*_snapshotStore,*/
                    cancellationToken
                )
                .ConfigureAwait(false);
            return aggregate;
        }

        public async Task<IAggregateEventResult> UpdateAsync<TAggregate, TIdentity>(
            TIdentity id,
            ISourceId sourceId,
            Func<TAggregate, CancellationToken, Task> updateAggregate,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            return await UpdateAsync<TAggregate, TIdentity, IAggregateEventResult>(
                    id,
                    sourceId,
                    async (a, c) =>
                    {
                        await updateAggregate(a, c).ConfigureAwait(false);
                        return AggregateEventResult.Success(id, a.Version);
                    },
                    cancellationToken
                )
                .ConfigureAwait(false);
        }

        public async Task<IAggregateEventResult> UpdateAsync<
            TAggregate,
            TIdentity,
            TExecutionResult
        >(
            TIdentity id,
            ISourceId sourceId,
            Func<TAggregate, CancellationToken, Task<TExecutionResult>> updateAggregate,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            await _aggregateStoreResilienceStrategy
                .BeforeAggregateUpdate<TAggregate, TIdentity, TExecutionResult>(
                    id,
                    cancellationToken
                )
                .ConfigureAwait(false);

            var aggregateUpdateResult = await _transientFaultHandler
                .TryAsync(
                    async c =>
                    {
                        var aggregate = await LoadAsync<TAggregate, TIdentity>(id, c)
                            .ConfigureAwait(false);
                        if (aggregate.HasSourceId(sourceId))
                        {
                            throw new GeneralProcessingException(
                                ResultCodeApplication.DuplicateOperation,
                                $"Aggregate '{typeof(TAggregate).PrettyPrint()}' has already had operation '{sourceId}' performed"
                            );
                        }

                        cancellationToken = _cancellationConfiguration.Limit(
                            cancellationToken,
                            CancellationBoundaryTypes.BeforeUpdatingAggregate
                        );

                        var result = await updateAggregate(aggregate, c).ConfigureAwait(false);
                        if (result.Failed)
                        {
                            _logger.LogWarning(
                                "Execution failed on aggregate {AggregateType}, disregarding any events emitted",
                                typeof(TAggregate).PrettyPrint()
                            );

                            result.SetDomainEvents(EmptyDomainEventCollection);
                            return result;
                        }

                        cancellationToken = _cancellationConfiguration.Limit(
                            cancellationToken,
                            CancellationBoundaryTypes.BeforeCommittingEvents
                        );

                        await _aggregateStoreResilienceStrategy
                            .BeforeCommitAsync<TAggregate, TIdentity, TExecutionResult>(
                                aggregate,
                                result,
                                cancellationToken
                            )
                            .ConfigureAwait(false);
                        try
                        {
                            var domainEvents = await aggregate
                                .CommitAsync(
                                    _eventStore,
                                    /*_snapshotStore,*/
                                    sourceId,
                                    cancellationToken
                                )
                                .ConfigureAwait(false);
                            await _aggregateStoreResilienceStrategy
                                .CommitSucceededAsync<TAggregate, TIdentity, TExecutionResult>(
                                    aggregate,
                                    result,
                                    cancellationToken
                                )
                                .ConfigureAwait(false);

                            result.SetDomainEvents(domainEvents);
                            return result;
                        }
                        catch (OptimisticConcurrencyException)
                            when (!_configuration.ForwardOptimisticConcurrencyExceptions)
                        {
                            throw;
                        }
                        catch (Exception e)
                        {
                            var (handled, updatedAggregateUpdateResult) =
                                await _aggregateStoreResilienceStrategy
                                    .HandleCommitFailedAsync<
                                        TAggregate,
                                        TIdentity,
                                        TExecutionResult
                                    >(aggregate, result, e, cancellationToken)
                                    .ConfigureAwait(false);
                            if (!handled)
                            {
                                throw;
                            }

                            return updatedAggregateUpdateResult;
                        }
                    },
                    Label.Named("aggregate-update"),
                    cancellationToken
                )
                .ConfigureAwait(false);

            if (aggregateUpdateResult.Succeeded && aggregateUpdateResult.DomainEvents.Any())
            {
                await _aggregateStoreResilienceStrategy
                    .BeforeEventPublishAsync<TAggregate, TIdentity, IAggregateEventResult>(
                        id,
                        aggregateUpdateResult,
                        cancellationToken
                    )
                    .ConfigureAwait(false);
                try
                {
                    var domainEventPublisher =
                        _serviceProvider.GetRequiredService<IDomainEventPublisher>();
                    await domainEventPublisher
                        .PublishAsync(aggregateUpdateResult.DomainEvents, cancellationToken)
                        .ConfigureAwait(false);
                    await _aggregateStoreResilienceStrategy
                        .EventPublishSucceededAsync<TAggregate, TIdentity, IAggregateEventResult>(
                            id,
                            aggregateUpdateResult,
                            cancellationToken
                        )
                        .ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    if (
                        !await _aggregateStoreResilienceStrategy
                            .HandleEventPublishFailedAsync<
                                TAggregate,
                                TIdentity,
                                IAggregateEventResult
                            >(id, aggregateUpdateResult, e, cancellationToken)
                            .ConfigureAwait(false)
                    )
                    {
                        throw;
                    }
                }
            }
            else
            {
                await _aggregateStoreResilienceStrategy
                    .EventPublishSkippedAsync<TAggregate, TIdentity, IAggregateEventResult>(
                        id,
                        aggregateUpdateResult,
                        cancellationToken
                    )
                    .ConfigureAwait(false);
            }

            return aggregateUpdateResult;
        }

        public async Task<IAggregateEventResult> StoreAsync<TAggregate, TIdentity>(
            TAggregate aggregate,
            ISourceId sourceId,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            var domainEvents = await aggregate
                .CommitAsync(
                    _eventStore, /*_snapshotStore,*/
                    sourceId,
                    cancellationToken
                )
                .ConfigureAwait(false);

            if (domainEvents.Any())
            {
                var domainEventPublisher =
                    _serviceProvider.GetRequiredService<IDomainEventPublisher>();
                await domainEventPublisher
                    .PublishAsync(domainEvents, cancellationToken)
                    .ConfigureAwait(false);
            }

            return AggregateEventResult.Success(aggregate.Id, aggregate.Version, domainEvents);
        }
    }
}
