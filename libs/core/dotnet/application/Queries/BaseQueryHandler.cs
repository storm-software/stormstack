using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Reaction.Application.Queries
{
  public abstract class BaseQueryHandler<TRequest, TData>
    : IRequestHandler<TRequest, Result<TData>>
    where TRequest : class, IRequest<Result<TData>>
  {
    protected readonly IMapper Mapper;

    protected readonly ILogger<BaseQueryHandler<TRequest, TData>> Logger;

    public BaseQueryHandler(IMapper mapper,
      ILogger<BaseQueryHandler<TRequest, TData>> logger)
    {
        Mapper = mapper;
        Logger = logger;
    }

    public async Task<Result<TData>> Handle(TRequest request,
      CancellationToken cancellationToken)
    {
        Logger.LogDebug($"Query processing - {request.GetType().Name}");

        var queryResult = await InnerHandleAsync(request,
        cancellationToken);
        if (queryResult == null)
          return Result<TData>.Failure(typeof(ResultCodeApplication),
            ResultCodeApplication.NoResultsFound);

        Logger.LogDebug($"Query complete - {request.GetType().Name}");

        return await MapResponseAsync(queryResult,
          cancellationToken);
    }

    protected abstract ValueTask<object> InnerHandleAsync(TRequest request,
      CancellationToken cancellationToken);

    protected async virtual ValueTask<Result<TData>> MapResponseAsync(object queryResult,
      CancellationToken cancellationToken)
    {
      return Result<TData>.Success(Mapper.Map<TData>(queryResult));
    }
  }
}
