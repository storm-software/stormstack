using AutoMapper;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Reaction.Application.Queries
{
    public abstract class BaseListQueryHandler<TRequest, TData>
        : BaseQueryHandler<TRequest, Paged<TData>>,
            IQueryListHandler<TRequest, TData>
        where TRequest : class, IQuery<Paged<TData>>
    {
        public BaseListQueryHandler(
            IMapper mapper,
            ILogger<BaseListQueryHandler<TRequest, TData>> logger
        )
            : base(mapper, logger) { }

        protected abstract Task<Paged<object>> HandleQueryAsync(
            TRequest request,
            CancellationToken cancellationToken
        );

        protected override async ValueTask<object> InnerHandleAsync(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            var result = await HandleQueryAsync(request, cancellationToken);
            if (result == null || (result is IList<TData> listResult && listResult.Count == 0))
                throw new NotFoundException();

            return result;
        }
    }
}
