using AutoMapper;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.Application.Queries
{
    public abstract class BaseQueryHandler<TRequest, TResponse> : IQueryHandler<TRequest, TResponse>
        where TRequest : class, IQuery<TResponse>
    {
        protected readonly IMapper Mapper;

        protected readonly ILogger<BaseQueryHandler<TRequest, TResponse>> Logger;

        public BaseQueryHandler(
            IMapper mapper,
            ILogger<BaseQueryHandler<TRequest, TResponse>> logger
        )
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
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

        protected virtual ValueTask<TResponse> MapResponseAsync(
            object queryResult,
            CancellationToken cancellationToken
        )
        {
            return ValueTask.FromResult(Mapper.Map<TResponse>(queryResult));
        }
    }
}
