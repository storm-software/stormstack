using System.Reflection;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public class SagaAggregateStore : SagaStore
    {
        private readonly IServiceProvider _serviceProvider;

        private readonly IAggregateStore _aggregateStore;

        private readonly IMemoryCache _memoryCache;

        public SagaAggregateStore(
            IServiceProvider serviceProvider,
            IAggregateStore aggregateStore,
            IMemoryCache memoryCache
        )
        {
            _serviceProvider = serviceProvider;
            _aggregateStore = aggregateStore;
            _memoryCache = memoryCache;
        }

        public override async Task<ISaga> UpdateAsync(
            SagaId sagaId,
            Type sagaType,
            ISourceId sourceId,
            Func<ISaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        )
        {
            var saga = null as ISaga;

            var storeAggregateSagaAsync = await GetUpdateAsync(sagaType, cancellationToken)
                .ConfigureAwait(false);

            await storeAggregateSagaAsync(
                    this,
                    sagaId,
                    sourceId,
                    async (s, c) =>
                    {
                        await updateSaga(s, c).ConfigureAwait(false);
                        saga = s;
                    },
                    cancellationToken
                )
                .ConfigureAwait(false);

            if (saga is null)
                return null;

            var commandBus = _serviceProvider.GetRequiredService<ICommandBus>();
            await saga.PublishAsync(commandBus, cancellationToken).ConfigureAwait(false);

            return saga;
        }

        private async Task<
            Func<
                SagaAggregateStore,
                SagaId,
                ISourceId,
                Func<ISaga, CancellationToken, Task>,
                CancellationToken,
                Task<IReadOnlyCollection<IDomainEvent>>
            >
        > GetUpdateAsync(Type sagaType, CancellationToken _)
        {
            var value = await _memoryCache
                .GetOrCreateAsync(
                    CacheKey.With(GetType(), sagaType.GetCacheKey()),
                    e =>
                    {
                        e.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
                        var aggregateRootType = sagaType
                            .GetTypeInfo()
                            .GetInterfaces()
                            .FirstOrDefault(
                                i =>
                                    i.GetTypeInfo().IsGenericType
                                    && i.GetGenericTypeDefinition() == typeof(IAggregateRoot<>)
                            );

                        if (aggregateRootType == null)
                            throw new ArgumentException(
                                $"Saga '{sagaType.PrettyPrint()}' is not a aggregate root"
                            );

                        var methodInfo = GetType()
                            .GetTypeInfo()
                            .GetMethod(nameof(UpdateAggregateAsync));
                        var identityType = aggregateRootType.GetTypeInfo().GetGenericArguments()[0];
                        var genericMethodInfo = methodInfo.MakeGenericMethod(
                            sagaType,
                            identityType
                        );
                        return Task.FromResult<
                            Func<
                                SagaAggregateStore,
                                SagaId,
                                ISourceId,
                                Func<ISaga, CancellationToken, Task>,
                                CancellationToken,
                                Task<IReadOnlyCollection<IDomainEvent>>
                            >
                        >(
                            (sas, id, sid, u, c) =>
                                (Task<IReadOnlyCollection<IDomainEvent>>)
                                    genericMethodInfo.Invoke(sas, new object[] { id, sid, u, c })
                        );
                    }
                )
                .ConfigureAwait(false);

            return value;
        }

        public async Task<IAggregateEventResult> UpdateAggregateAsync<TAggregate, TIdentity>(
            TIdentity id,
            ISourceId sourceId,
            Func<TAggregate, CancellationToken, Task> updateAggregate,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>, ISaga
            where TIdentity : IIdentity
        {
            return await _aggregateStore
                .UpdateAsync(id, sourceId, updateAggregate, cancellationToken)
                .ConfigureAwait(false);
        }
    }
}
