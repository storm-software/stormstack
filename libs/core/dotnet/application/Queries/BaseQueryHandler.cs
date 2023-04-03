using AutoMapper;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public abstract class BaseQueryHandler<TRequest, TReadModel>
        : IQueryHandler<TRequest, TReadModel>
        where TRequest : class, IQuery<TReadModel>
        where TReadModel : ReadModel
    {
        protected readonly IMapper Mapper;

        protected readonly ILogger<BaseQueryHandler<TRequest, TReadModel>> Logger;

        public BaseQueryHandler(
            IMapper mapper,
            ILogger<BaseQueryHandler<TRequest, TReadModel>> logger
        )
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<TReadModel> Handle(TRequest request, CancellationToken cancellationToken)
        {
            Logger.LogDebug($"Query processing - {request.GetType().Name}");

            var queryResult = await InnerHandleAsync(request, cancellationToken);
            if (queryResult == null)
                throw new NotFoundException();

            Logger.LogDebug($"Query complete - {request.GetType().Name}");

            return await MapResponseAsync(queryResult, cancellationToken);
        }

        protected abstract ValueTask<object> InnerHandleAsync(
            TRequest request,
            CancellationToken cancellationToken
        );

        protected virtual ValueTask<TReadModel> MapResponseAsync(
            object queryResult,
            CancellationToken cancellationToken
        )
        {
            return ValueTask.FromResult(Mapper.Map<TReadModel>(queryResult));
        }
    }
}
