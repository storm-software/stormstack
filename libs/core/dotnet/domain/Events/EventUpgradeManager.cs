using System.Runtime.CompilerServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public class EventUpgradeManager : IEventUpgradeManager
    {
        private readonly ILogger<EventUpgradeManager> _logger;

        private readonly IServiceProvider _serviceProvider;

        private readonly IEventUpgradeContextFactory _eventUpgradeContextFactory;

        public EventUpgradeManager(
            ILogger<EventUpgradeManager> logger,
            IServiceProvider serviceProvider,
            IEventUpgradeContextFactory eventUpgradeContextFactory
        )
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _eventUpgradeContextFactory = eventUpgradeContextFactory;
        }

        public async IAsyncEnumerable<IDomainEvent> UpgradeAsync(
            IAsyncEnumerable<IDomainEvent> domainEvents,
            IEventUpgradeContext eventUpgradeContext,
            [EnumeratorCancellation] CancellationToken cancellationToken
        )
        {
            await foreach (var domainEvent in domainEvents.WithCancellation(cancellationToken))
            {
                var upgradeDomainEvents = new List<IDomainEvent> { domainEvent };
                if (
                    !eventUpgradeContext.TryGetUpgraders(
                        domainEvent.AggregateType,
                        out var eventUpgraders
                    )
                )
                {
                    eventUpgraders = ResolveUpgraders(
                        domainEvent.AggregateType,
                        domainEvent.IdentityType
                    );
                    eventUpgradeContext.AddUpgraders(domainEvent.AggregateType, eventUpgraders);
                }

                foreach (var eventUpgrader in eventUpgraders)
                {
                    var buffer = new List<IDomainEvent>();

                    foreach (var upgradeDomainEvent in upgradeDomainEvents)
                    {
                        await foreach (
                            var upgradedDomainEvent in eventUpgrader.UpgradeAsync(
                                upgradeDomainEvent,
                                eventUpgradeContext,
                                cancellationToken
                            )
                        )
                        {
                            buffer.Add(upgradedDomainEvent);
                        }
                    }

                    upgradeDomainEvents = buffer;
                }

                foreach (var upgradeDomainEvent in upgradeDomainEvents)
                {
                    yield return upgradeDomainEvent;
                }
            }
        }

        public async IAsyncEnumerable<IDomainEvent<TAggregate, TIdentity>> UpgradeAsync<
            TAggregate,
            TIdentity
        >(
            IAsyncEnumerable<IDomainEvent<TAggregate, TIdentity>> domainEvents,
            [EnumeratorCancellation] CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            var eventUpgradeContext = await _eventUpgradeContextFactory.CreateAsync(
                cancellationToken
            );
            var eventUpgraders = ResolveUpgraders(typeof(TAggregate), typeof(TIdentity));
            eventUpgradeContext.AddUpgraders(typeof(TAggregate), eventUpgraders);

            await foreach (var domainEvent in domainEvents.WithCancellation(cancellationToken))
            {
                var upgradeDomainEvents = new List<IDomainEvent<TAggregate, TIdentity>>
                {
                    domainEvent
                };

                foreach (var eventUpgrader in eventUpgraders)
                {
                    var buffer = new List<IDomainEvent<TAggregate, TIdentity>>();

                    if (_logger.IsEnabled(LogLevel.Trace))
                    {
                        _logger.LogTrace(
                            "Using upgrader {EventUpgraderType} to upgrade {DomainEventType}",
                            eventUpgrader.GetType().PrettyPrint(),
                            domainEvent.GetType().PrettyPrint()
                        );
                    }

                    foreach (var upgradeDomainEvent in upgradeDomainEvents)
                    {
                        await foreach (
                            var upgradedDomainEvent in eventUpgrader.UpgradeAsync(
                                upgradeDomainEvent,
                                eventUpgradeContext,
                                cancellationToken
                            )
                        )
                        {
                            buffer.Add((IDomainEvent<TAggregate, TIdentity>)upgradedDomainEvent);
                        }
                    }

                    if (_logger.IsEnabled(LogLevel.Trace))
                    {
                        if (buffer.Count == 0)
                        {
                            _logger.LogTrace(
                                "Event upgrader {EventUpgraderType} removed the {DomainEventType} from the history!",
                                eventUpgrader.GetType().PrettyPrint(),
                                domainEvent.EventType.PrettyPrint()
                            );
                        }
                        else if (buffer.Count == 1 && ReferenceEquals(buffer[0], domainEvent))
                        {
                            _logger.LogTrace(
                                "Event upgrader {EventUpgraderType} did not do anything to {DomainEventType}",
                                eventUpgrader.GetType().PrettyPrint(),
                                domainEvent.EventType.PrettyPrint()
                            );
                        }
                        else if (buffer.Count == 1)
                        {
                            _logger.LogTrace(
                                "Event upgrader {EventUpgraderType} upgraded {DomainEventType} to {UpgradedDomainEventType}",
                                eventUpgrader.GetType().PrettyPrint(),
                                domainEvent.EventType.PrettyPrint(),
                                buffer[0].EventType.PrettyPrint()
                            );
                        }
                        else
                        {
                            var prettyNames = buffer
                                .Select(e => e.EventType.PrettyPrint())
                                .ToArray();
                            _logger.LogTrace(
                                "Event upgrader {EventUpgraderType} upgraded {DomainEventType} to the following events {UpgradedDomainEventTypes}",
                                eventUpgrader.GetType().PrettyPrint(),
                                domainEvent.EventType.PrettyPrint(),
                                prettyNames
                            );
                        }
                    }

                    upgradeDomainEvents = buffer;
                }

                foreach (var upgradeDomainEvent in upgradeDomainEvents)
                {
                    yield return upgradeDomainEvent;
                }
            }
        }

        protected virtual IReadOnlyCollection<IEventUpgrader> ResolveUpgraders(
            Type aggregateType,
            Type identityType
        )
        {
            var type = typeof(IEventUpgrader<,>).MakeGenericType(aggregateType, identityType);
            return _serviceProvider
                .GetServices(type)
                .OrderBy(u => u.GetType().Name)
                .Select(u => (IEventUpgrader)u)
                .ToList();
        }
    }
}
