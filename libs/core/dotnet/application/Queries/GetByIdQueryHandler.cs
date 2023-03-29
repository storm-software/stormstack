using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Application.Models;

namespace OpenSystem.Core.Application.Queries
{
    public class GetByIdQueryHandler<TReadStore, TReadModel>
        : IQueryHandler<GetByIdQuery<TReadModel>, TReadModel>
        where TReadStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        private readonly TReadStore _readStore;

        public GetByIdQueryHandler(TReadStore readStore)
        {
            _readStore = readStore;
        }

        public async Task<TReadModel> Handle(
            GetByIdQuery<TReadModel> query,
            CancellationToken cancellationToken
        )
        {
            var readModelEnvelope = await _readStore
                .GetAsync(query.Id, cancellationToken)
                .ConfigureAwait(false);
            return readModelEnvelope.ReadModel;
        }
    }
}
