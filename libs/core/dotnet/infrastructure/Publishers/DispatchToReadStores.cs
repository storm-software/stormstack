using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.Publishers;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Infrastructure.Publishers
{
    public class DispatchToReadStores : IDispatchToReadStores
    {
        private readonly IDispatchToReadStoresResilienceStrategy _dispatchToReadStoresResilienceStrategy;

        private readonly IReadOnlyCollection<IReadStoreManager> _readStoreManagers;

        public DispatchToReadStores(
            IEnumerable<IReadStoreManager> readStoreManagers,
            IDispatchToReadStoresResilienceStrategy dispatchToReadStoresResilienceStrategy
        )
        {
            _dispatchToReadStoresResilienceStrategy = dispatchToReadStoresResilienceStrategy;
            _readStoreManagers = readStoreManagers.ToList();
        }

        public async Task DispatchAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            var updateReadStoresTasks = _readStoreManagers.Select(async rsm =>
            {
                await _dispatchToReadStoresResilienceStrategy
                    .BeforeUpdateAsync(rsm, domainEvents, cancellationToken)
                    .ConfigureAwait(false);
                try
                {
                    await rsm.UpdateReadStoresAsync(domainEvents, cancellationToken);
                    await _dispatchToReadStoresResilienceStrategy
                        .UpdateSucceededAsync(rsm, domainEvents, cancellationToken)
                        .ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    if (
                        !await _dispatchToReadStoresResilienceStrategy
                            .HandleUpdateFailedAsync(rsm, domainEvents, e, cancellationToken)
                            .ConfigureAwait(false)
                    )
                    {
                        throw;
                    }
                }
            });

            await Task.WhenAll(updateReadStoresTasks).ConfigureAwait(false);
        }
    }
}
