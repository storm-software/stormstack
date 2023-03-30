using AutoMapper;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public abstract class BaseListQueryHandler<TRequest, TPagedListReadModel, TData>
        : BaseQueryHandler<TRequest, TPagedListReadModel>,
            IQueryListHandler<TRequest, TPagedListReadModel, TData>
        where TRequest : class, IQuery<TPagedListReadModel>
        where TPagedListReadModel : PagedListReadModel<TData>
    {
        public BaseListQueryHandler(
            IMapper mapper,
            ILogger<BaseListQueryHandler<TRequest, TPagedListReadModel, TData>> logger
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
            if (result == null || (result is List<TData> listResult && listResult.Count == 0))
                throw new NotFoundException();

            return result;
        }
    }
}
