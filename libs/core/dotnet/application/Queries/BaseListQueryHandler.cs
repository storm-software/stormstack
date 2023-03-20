using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Reaction.Application.Queries
{
  public abstract class BaseListQueryHandler<TRequest, TData>
    : BaseQueryHandler<TRequest, TData>
    where TRequest : class, IRequest<QueryResult<TData>>
  {
    public BaseListQueryHandler(IMapper mapper,
      ILogger<BaseListQueryHandler<TRequest, TData>> logger)
      : base(mapper,
          logger)
    {
    }

    protected abstract Task<ListQueryResult> HandleQueryAsync(TRequest request,
      CancellationToken cancellationToken);
      
    protected override async ValueTask<QueryResult> InnerHandleAsync(TRequest request,
      CancellationToken cancellationToken)
    {
      ListQueryResult queryResult = await HandleQueryAsync(request,
      cancellationToken);
      if (queryResult?.Data == null || queryResult?.Data.Count == 0)
        return ListQueryResult<TData>.Failure(typeof(ResultCodeApplication),
          ResultCodeApplication.NoResultsFound);

      return queryResult;
    }
  }
}
