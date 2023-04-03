using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Jobs;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Subscribers
{
    public class DomainEventPublisher : IDomainEventPublisher
    {
        private readonly IDispatchToEventSubscribers _dispatchToEventSubscribers;

        private readonly IDispatchToSagas _dispatchToSagas;

        private readonly IJobScheduler _jobScheduler;

        private readonly IServiceProvider _serviceProvider;

        private readonly EventSourcingSettings _configuration;

        private readonly ICancellationSettings _cancellationSettings;

        private readonly IDispatchToReadStores _dispatchToReadStores;

        private readonly IReadOnlyCollection<ISubscribeSynchronousToAll> _subscribeSynchronousToAlls;

        public DomainEventPublisher(
            IDispatchToEventSubscribers dispatchToEventSubscribers,
            IDispatchToSagas dispatchToSagas,
            IJobScheduler jobScheduler,
            IServiceProvider serviceProvider,
            EventSourcingSettings configuration,
            IEnumerable<ISubscribeSynchronousToAll> subscribeSynchronousToAlls,
            ICancellationSettings cancellationSettings,
            IDispatchToReadStores dispatchToReadStores
        )
        {
            _dispatchToEventSubscribers = dispatchToEventSubscribers;
            _dispatchToSagas = dispatchToSagas;
            _jobScheduler = jobScheduler;
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _cancellationSettings = cancellationSettings;
            _dispatchToReadStores = dispatchToReadStores;
            _subscribeSynchronousToAlls = subscribeSynchronousToAlls.ToList();
        }

        public Task PublishAsync<TAggregate, TIdentity>(
            TIdentity id,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            return PublishAsync(domainEvents, cancellationToken);
        }

        public async Task PublishAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            cancellationToken = _cancellationSettings.Limit(
                cancellationToken,
                CancellationBoundaryTypes.BeforeUpdatingReadStores
            );
            await PublishToReadStoresAsync(domainEvents, cancellationToken).ConfigureAwait(false);

            cancellationToken = _cancellationSettings.Limit(
                cancellationToken,
                CancellationBoundaryTypes.BeforeNotifyingSubscribers
            );
            await PublishToSubscribersOfAllEventsAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);

            // Update subscriptions AFTER read stores have been updated
            await PublishToSynchronousSubscribersAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);
            await PublishToAsynchronousSubscribersAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);

            await PublishToSagasAsync(domainEvents, cancellationToken).ConfigureAwait(false);
        }

        private async Task PublishToReadStoresAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            await _dispatchToReadStores
                .DispatchAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);
        }

        private async Task PublishToSubscribersOfAllEventsAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            var handle = _subscribeSynchronousToAlls.Select(
                s => s.HandleAsync(domainEvents, cancellationToken)
            );
            await Task.WhenAll(handle).ConfigureAwait(false);
        }

        private async Task PublishToSynchronousSubscribersAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            await _dispatchToEventSubscribers
                .DispatchToSynchronousSubscribersAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);
        }

        private async Task PublishToAsynchronousSubscribersAsync(
            IEnumerable<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            if (_configuration.IsAsynchronousSubscribersEnabled)
            {
                await Task.WhenAll(
                        domainEvents.Select(
                            d =>
                                _jobScheduler.ScheduleNowAsync(
                                    DispatchToAsynchronousEventSubscribersJob.Create(
                                        d,
                                        _serviceProvider
                                    ),
                                    cancellationToken
                                )
                        )
                    )
                    .ConfigureAwait(false);
            }
        }

        private async Task PublishToSagasAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            await _dispatchToSagas
                .ProcessAsync(domainEvents, cancellationToken)
                .ConfigureAwait(false);
        }
    }
}
