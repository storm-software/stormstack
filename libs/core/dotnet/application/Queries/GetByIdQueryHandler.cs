using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Application.Models;
using AutoMapper;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Queries
{
    public class GetByIdQueryHandler<TData, TReadModelStore, TReadModel, TIdentity>
        : IQueryHandler<GetByIdQuery<TData, TIdentity>, TData>
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
        where TIdentity : IIdentity
    {
        private readonly TReadModelStore _readModelStore;

        private readonly IMapper _mapper;

        public GetByIdQueryHandler(TReadModelStore readStore, IMapper mapper)
        {
            _readModelStore = readStore;
            _mapper = mapper;
        }

        public async Task<TData> Handle(
            GetByIdQuery<TData, TIdentity> query,
            CancellationToken cancellationToken
        )
        {
            var readModelEnvelope = await _readModelStore
                .GetAsync(query.Id.Value, cancellationToken)
                .ConfigureAwait(false);

            return _mapper.Map<TData>(readModelEnvelope.ReadModel);
        }
    }

    public class GetByIdQueryHandler<TReadModelStore, TReadModel, TIdentity>
        : GetByIdQueryHandler<TReadModel, TReadModelStore, TReadModel, TIdentity>
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
        where TIdentity : IIdentity
    {
        public GetByIdQueryHandler(TReadModelStore readStore, IMapper mapper)
            : base(readStore, mapper) { }
    }
}
