using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Application.Models;
using AutoMapper;

namespace OpenSystem.Core.Application.Queries
{
    public class GetByIdQueryHandler<TData, TReadModelStore, TReadModel>
        : IQueryHandler<GetByIdQuery<TData>, TData>
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        private readonly TReadModelStore _readModelStore;

        private readonly IMapper _mapper;

        public GetByIdQueryHandler(TReadModelStore readStore, IMapper mapper)
        {
            _readModelStore = readStore;
            _mapper = mapper;
        }

        public async Task<TData> Handle(
            GetByIdQuery<TData> query,
            CancellationToken cancellationToken
        )
        {
            var readModelEnvelope = await _readModelStore
                .GetAsync(query.Id, cancellationToken)
                .ConfigureAwait(false);

            return _mapper.Map<TData>(readModelEnvelope.ReadModel);
        }
    }

    public class GetByIdQueryHandler<TReadModelStore, TReadModel>
        : GetByIdQueryHandler<TReadModel, TReadModelStore, TReadModel>
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        public GetByIdQueryHandler(TReadModelStore readStore, IMapper mapper)
            : base(readStore, mapper) { }
    }
}
