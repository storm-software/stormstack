using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Infrastructure.ReadStores.InMemory
{
    public class InMemoryReadStore<TReadModel>
        : ReadModelStore<TReadModel>,
            IInMemoryReadStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        private readonly Dictionary<string, ReadModelEnvelope<TReadModel>> _readModels =
            new Dictionary<string, ReadModelEnvelope<TReadModel>>();
        private readonly AsyncLock _asyncLock = new AsyncLock();

        public InMemoryReadStore(ILogger<InMemoryReadStore<TReadModel>> logger)
            : base(logger) { }

        public override async Task<ReadModelEnvelope<TReadModel>> GetAsync(
            string id,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                return _readModels.TryGetValue(id, out var readModelEnvelope)
                    ? readModelEnvelope
                    : ReadModelEnvelope<TReadModel>.Empty(id);
            }
        }

        public async Task<IReadOnlyCollection<TReadModel>> FindAsync(
            Predicate<TReadModel> predicate,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                return _readModels.Values
                    .Where(e => predicate(e.ReadModel))
                    .Select(e => e.ReadModel)
                    .ToList();
            }
        }

        public override async Task DeleteAsync(string id, CancellationToken cancellationToken)
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _readModels.Remove(id);
            }
        }

        public override async Task DeleteAllAsync(CancellationToken cancellationToken)
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _readModels.Clear();
            }
        }

        public override async Task UpdateAsync(
            IReadOnlyCollection<ReadModelUpdate> readModelUpdates,
            IReadModelContextFactory readModelContextFactory,
            Func<
                IReadModelContext,
                IReadOnlyCollection<IDomainEvent>,
                ReadModelEnvelope<TReadModel>,
                CancellationToken,
                Task<ReadModelEnvelope<TReadModel>>
            > updateReadModel,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                foreach (var readModelUpdate in readModelUpdates)
                {
                    var readModelId = readModelUpdate.ReadModelId;

                    var isNew = !_readModels.TryGetValue(readModelId, out var readModelEnvelope);

                    if (isNew)
                    {
                        readModelEnvelope = ReadModelEnvelope<TReadModel>.Empty(readModelId);
                    }

                    var readModelContext = readModelContextFactory.Create(readModelId, isNew);

                    var readModelUpdateEnvelope = await updateReadModel(
                            readModelContext,
                            readModelUpdate.DomainEvents,
                            readModelEnvelope,
                            cancellationToken
                        )
                        .ConfigureAwait(false);
                    if (!readModelUpdateEnvelope.IsModified)
                        continue;

                    if (readModelContext.IsMarkedForDeletion)
                        _readModels.Remove(readModelId);
                    else
                        _readModels[readModelId] = readModelUpdateEnvelope;
                }
            }
        }
    }
}
