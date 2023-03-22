using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Reaction.Application.Queries
{
  public abstract class BaseListQueryHandler<TRequest, TData>
    : BaseQueryHandler<TRequest, Paged<TData>>
    where TRequest : class, IRequest<Result<Paged<TData>>>
  {
    public BaseListQueryHandler(IMapper mapper,
      ILogger<BaseListQueryHandler<TRequest, TData>> logger)
      : base(mapper,
          logger)
    {
    }

    protected abstract Task<Paged<object>> HandleQueryAsync(TRequest request,
      CancellationToken cancellationToken);

    protected override async ValueTask<object> InnerHandleAsync(TRequest request,
      CancellationToken cancellationToken)
    {
      var result = await HandleQueryAsync(request,
      cancellationToken);
      if (result == null ||
        (result is IList<TData> listResult &&
          listResult.Count == 0))
        return Result<TData>.Failure(typeof(ResultCodeApplication),
          ResultCodeApplication.NoResultsFound);

      return result;
    }
  }
}
